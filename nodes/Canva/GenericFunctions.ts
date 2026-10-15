import {
	NodeApiError,
	NodeOperationError,
	sleep,
	type IDataObject,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type JsonObject,
} from 'n8n-workflow';

import { version } from '../../package.json';

const BASE_URL = 'https://api.canva.com/rest/v1';

const MAX_RATE_LIMIT_RETRIES = 3;

/**
 * 429 error codes for a used-up quota: AI credits (`credit_quota_exceeded`), or the free autofill and
 * resize trials (`quota_exceeded`). These won't reset within the retry window, so retrying only delays
 * the error. Other 429s (rate limits, `credit_quota_cooldown`) are retried.
 *
 * Each maps to the error title shown instead of n8n's generic "too many requests" for a 429, which
 * suggests that waiting will help. Canva's own message stays as the error's description.
 */
const QUOTA_EXHAUSTED_TITLES = new Map([
	['credit_quota_exceeded', 'The Canva user is out of AI credits'],
	['quota_exceeded', 'The Canva user has used up their free quota for this feature'],
]);

/**
 * Identifies this node's traffic in Canva's API request logs, distinguishing it
 * from generic n8n HTTP Request node usage. Do not remove: used for adoption analytics.
 */
const USER_AGENT = `n8n-nodes-canva/${version}`;

type HttpErrorResponse = { status?: number; headers?: Record<string, string | undefined> };

type ApiRequestError = {
	httpCode?: string;
	statusCode?: number;
	context?: { data?: { code?: string } };
	response?: HttpErrorResponse;
	cause?: { response?: HttpErrorResponse }; // n8n wraps request errors but keeps the original Axios error on `cause` (not on n8n <= 2.30).
};

export async function canvaApiRequest(
	ctx: IExecuteFunctions,
	options: IHttpRequestOptions,
): Promise<unknown> {
	options.baseURL = BASE_URL;
	options.headers = { 'user-agent': USER_AGENT, ...options.headers };

	for (let attempt = 0; ; attempt++) {
		try {
			return await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'canvaOAuth2Api', options);
		} catch (error) {
			// Retry rate-limited requests (429), honouring Retry-After when provided.
			// Safe to retry: a 429 means Canva rejected the request without processing it.
			const err = error as ApiRequestError;
			const status = err.httpCode ?? err.statusCode ?? err.response?.status;

			// A used-up quota is also a 429, but it won't reset in time, so fail straight away.
			const code = err.context?.data?.code;
			const quotaTitle = code ? QUOTA_EXHAUSTED_TITLES.get(code) : undefined;

			if (String(status) !== '429' || quotaTitle || attempt >= MAX_RATE_LIMIT_RETRIES) {
				// n8n has already wrapped the error, so this returns that same NodeApiError.
				const apiError = new NodeApiError(ctx.getNode(), error as JsonObject);
				if (quotaTitle) apiError.message = quotaTitle;
				throw apiError;
			}

			const headers = err.cause?.response?.headers ?? err.response?.headers;
			const retryAfter = Number(headers?.['retry-after']);
			const waitMs = retryAfter > 0 ? retryAfter * 1000 : 5000 * 2 ** attempt; // 5s, 10s, 20s fallback
			await sleep(waitMs);
		}
	}
}

export type CanvaJobResponse = {
	// Some job APIs (e.g. image transformations) only return an ID while the job is in progress:
	// a job that finishes straight away comes back with its result (or error) and no ID.
	job: { id?: string; status: string; error?: { code: string; message: string } };
};

type CanvaJobOptions = {
	/** Job name used in error messages, e.g. "Export". */
	kind: string;
	/** Endpoint that creates the job. Its status is polled at `${path}/${jobId}`. */
	path: string;
	body: IDataObject;
	/** Milliseconds between status checks. */
	pollInterval: number;
	/** Milliseconds to wait for the job to finish before timing out. */
	maxWait: number;
};

/**
 * Creates a Canva async job and polls it until it is no longer `in_progress`.
 * Returns the last job response, and throws if the job times out or fails.
 */
export async function runCanvaJob(
	ctx: IExecuteFunctions,
	itemIndex: number,
	{ kind, path, body, pollInterval, maxWait }: CanvaJobOptions,
): Promise<CanvaJobResponse> {
	const createResp = (await canvaApiRequest(ctx, {
		method: 'POST',
		url: path,
		body,
		json: true,
	})) as CanvaJobResponse;

	const jobId = createResp.job.id;
	const jobLabel = jobId ? `${kind} job ${jobId}` : `${kind} job`;
	const deadline = Date.now() + maxWait;
	let jobResp = createResp;

	while (jobResp.job.status === 'in_progress') {
		if (Date.now() >= deadline) {
			throw new NodeOperationError(
				ctx.getNode(),
				`${jobLabel} timed out after ${maxWait / 1000}s`,
				{ itemIndex },
			);
		}
		await sleep(pollInterval);
		jobResp = (await canvaApiRequest(ctx, {
			method: 'GET',
			url: `${path}/${jobId}`,
			json: true,
		})) as CanvaJobResponse;
	}

	// Include Canva's reason (e.g. moderation or quota errors) so the user can tell
	// whether retrying, or retrying with different input, could help.
	if (jobResp.job.status === 'failed') {
		const reason = jobResp.job.error?.message;
		throw new NodeOperationError(
			ctx.getNode(),
			`${jobLabel} failed${reason ? `: ${reason}` : ''}`,
			{ itemIndex },
		);
	}

	return jobResp;
}

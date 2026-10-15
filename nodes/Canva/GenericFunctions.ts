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

			// Running out of AI credits is also a 429, but the quota won't reset within the
			// retry window, so fail straight away instead of waiting.
			const creditQuotaExceeded = err.context?.data?.code === 'credit_quota_exceeded';

			if (String(status) !== '429' || creditQuotaExceeded || attempt >= MAX_RATE_LIMIT_RETRIES) {
				throw new NodeApiError(ctx.getNode(), error as JsonObject);
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

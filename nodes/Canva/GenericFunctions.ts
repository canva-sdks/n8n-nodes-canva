import {
	NodeApiError,
	sleep,
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

type ApiRequestError = {
	httpCode?: string;
	statusCode?: number;
	response?: { status?: number; headers?: Record<string, string> };
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
			if (String(status) !== '429' || attempt >= MAX_RATE_LIMIT_RETRIES) {
				throw new NodeApiError(ctx.getNode(), error as JsonObject);
			}

			const retryAfter = Number(err.response?.headers?.['retry-after']);
			const waitMs = retryAfter > 0 ? retryAfter * 1000 : 5000 * 2 ** attempt; // 5s, 10s, 20s fallback
			await sleep(waitMs);
		}
	}
}

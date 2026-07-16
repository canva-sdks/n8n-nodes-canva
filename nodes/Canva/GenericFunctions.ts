import type { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

import { version } from '../../package.json';

const BASE_URL = 'https://api.canva.com/rest/v1';

/**
 * Identifies this node's traffic in Canva's API request logs, distinguishing it
 * from generic n8n HTTP Request node usage. Do not remove: used for adoption analytics.
 */
const USER_AGENT = `n8n-nodes-canva/${version}`;

export async function canvaApiRequest(
	ctx: IExecuteFunctions,
	options: IHttpRequestOptions,
): Promise<unknown> {
	options.baseURL = BASE_URL;
	options.headers = { 'user-agent': USER_AGENT, ...options.headers };
	return await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'canvaOAuth2Api', options);
}

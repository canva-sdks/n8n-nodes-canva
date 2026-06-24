import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	sleep,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';

import { designDescription } from './resources/design';
import { exportDescription } from './resources/export';
import { userDescription } from './resources/user';
import { folderDescription } from './resources/folder';
import { assetDescription } from './resources/asset';

const BASE_URL = 'https://api.canva.com/rest/v1';

export class Canva implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva',
		name: 'canva',
		icon: { light: 'file:canva.svg', dark: 'file:canva.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Canva API',
		defaults: { name: 'Canva' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'canvaOAuth2Api', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Asset', value: 'asset' },
					{ name: 'Design', value: 'design' },
					{ name: 'Export', value: 'export' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'User', value: 'user' },
				],
				default: 'design',
			},
			...designDescription,
			...exportDescription,
			...userDescription,
			...folderDescription,
			...assetDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: unknown;

				// ─── Design ────────────────────────────────────────────────────────
				if (resource === 'design') {
					if (operation === 'create') {
						const designType = this.getNodeParameter('designType', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const assetId = this.getNodeParameter('assetId', i) as string;

						let design_type: IDataObject;
						if (designType === 'preset') {
							const presetName = this.getNodeParameter('presetName', i) as string;
							design_type = { type: 'preset', name: presetName };
						} else {
							const width = this.getNodeParameter('width', i) as number;
							const height = this.getNodeParameter('height', i) as number;
							design_type = { type: 'custom', width, height };
						}

						const body: IDataObject = { type: 'type_and_asset', design_type };
						if (title) body.title = title;
						if (assetId) body.asset_id = assetId;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/designs`,
								body,
								json: true,
							},
						);
					} else if (operation === 'get') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${designId}`,
								json: true,
							},
						);
					} else if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i) as number);
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = { limit };
						if (filters.query) qs.query = filters.query;
						if (filters.ownership) qs.ownership = filters.ownership;
						if (filters.sort_by) qs.sort_by = filters.sort_by;

						if (returnAll) {
							const allItems: unknown[] = [];
							let continuation: string | undefined;
							do {
								if (continuation) qs.continuation = continuation;
								const resp = (await this.helpers.httpRequestWithAuthentication.call(
									this,
									'canvaOAuth2Api',
									{ method: 'GET', url: `${BASE_URL}/designs`, qs, json: true },
								)) as { items?: unknown[]; continuation?: string };
								allItems.push(...(resp.items ?? []));
								continuation = resp.continuation;
							} while (continuation);
							responseData = { items: allItems };
						} else {
							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{ method: 'GET', url: `${BASE_URL}/designs`, qs, json: true },
							);
						}
					}
				}

				// ─── Export ────────────────────────────────────────────────────────
				else if (resource === 'export') {
					if (operation === 'export') {
						const designId = this.getNodeParameter('designId', i) as string;
						const format = this.getNodeParameter('format', i) as string;
						const pagesRaw = this.getNodeParameter('pages', i) as string;
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						const exportFormat: IDataObject = { type: format };
						if (pagesRaw.trim()) {
							exportFormat.pages = pagesRaw
								.split(',')
								.map((p) => parseInt(p.trim(), 10))
								.filter((n) => !isNaN(n));
						}

						// 1. Create export job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/exports`,
								body: { design_id: designId, format: exportFormat },
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const exportId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Export job ${exportId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/exports/${exportId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(this.getNode(), `Export job ${exportId} failed`, {
								itemIndex: i,
							});
						}

						responseData = jobResp;
					}
				}

				// ─── User ──────────────────────────────────────────────────────────
				else if (resource === 'user') {
					if (operation === 'getMe') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{ method: 'GET', url: `${BASE_URL}/users/me`, json: true },
						);
					} else if (operation === 'getProfile') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{ method: 'GET', url: `${BASE_URL}/users/me/profile`, json: true },
						);
					}
				}

				// ─── Folder ────────────────────────────────────────────────────────
				else if (resource === 'folder') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const parentFolderId = this.getNodeParameter('parentFolderId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/folders`,
								body: { name, parent_folder_id: parentFolderId },
								json: true,
							},
						);
					} else if (operation === 'get') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{ method: 'GET', url: `${BASE_URL}/folders/${folderId}`, json: true },
						);
					} else if (operation === 'listItems') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i) as number);
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = { limit };
						if (filters.sort_by) qs.sort_by = filters.sort_by;
						if (Array.isArray(filters.item_types) && filters.item_types.length > 0) {
							qs.item_types = (filters.item_types as string[]).join(',');
						}

						if (returnAll) {
							const allItems: unknown[] = [];
							let continuation: string | undefined;
							do {
								if (continuation) qs.continuation = continuation;
								const resp = (await this.helpers.httpRequestWithAuthentication.call(
									this,
									'canvaOAuth2Api',
									{
										method: 'GET',
										url: `${BASE_URL}/folders/${folderId}/items`,
										qs,
										json: true,
									},
								)) as { items?: unknown[]; continuation?: string };
								allItems.push(...(resp.items ?? []));
								continuation = resp.continuation;
							} while (continuation);
							responseData = { items: allItems };
						} else {
							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/folders/${folderId}/items`,
									qs,
									json: true,
								},
							);
						}
					}
				}

				// ─── Asset ─────────────────────────────────────────────────────────
				else if (resource === 'asset') {
					if (operation === 'get') {
						const assetId = this.getNodeParameter('assetId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{ method: 'GET', url: `${BASE_URL}/assets/${assetId}`, json: true },
						);
					}
				}

				if (responseData === undefined) {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation "${operation}" for resource "${resource}"`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: responseData as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

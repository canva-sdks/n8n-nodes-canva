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

import { autofillDescription } from './resources/autofill';
import { brandTemplateDescription } from './resources/brandTemplate';
import { commentDescription } from './resources/comment';
import { designDescription } from './resources/design';
import { designImportDescription } from './resources/designImport';
import { exportDescription } from './resources/export';
import { folderDescription } from './resources/folder';
import { mergeDescription } from './resources/merge';
import { resizeDescription } from './resources/resize';
import { assetDescription } from './resources/asset';
import { userDescription } from './resources/user';

const BASE_URL = 'https://api.canva.com/rest/v1';

export class Canva implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva',
		name: 'canva',
		icon: { light: 'file:icons/canva.svg', dark: 'file:icons/canva.dark.svg' },
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
					{ name: 'Autofill', value: 'autofill' },
					{ name: 'Brand Template', value: 'brandTemplate' },
					{ name: 'Comment (Preview API)', value: 'comment' },
					{ name: 'Design', value: 'design' },
					{ name: 'Design Import', value: 'designImport' },
					{ name: 'Export', value: 'export' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Merge (Preview API)', value: 'merge' },
					{ name: 'Resize', value: 'resize' },
					{ name: 'User', value: 'user' },
				],
				default: 'design',
			},
			...autofillDescription,
			...brandTemplateDescription,
			...commentDescription,
			...designDescription,
			...designImportDescription,
			...exportDescription,
			...folderDescription,
			...mergeDescription,
			...resizeDescription,
			...assetDescription,
			...userDescription,
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

				// ─── Asset ─────────────────────────────────────────────────────────
				if (resource === 'asset') {
					if (operation === 'delete') {
						const assetId = this.getNodeParameter('assetId', i) as string;
						await this.helpers.httpRequestWithAuthentication.call(this, 'canvaOAuth2Api', {
							method: 'DELETE',
							url: `${BASE_URL}/assets/${encodeURIComponent(assetId)}`,
							json: true,
						});
						responseData = { success: true };
					} else if (operation === 'get') {
						const assetId = this.getNodeParameter('assetId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/assets/${encodeURIComponent(assetId)}`,
								json: true,
							},
						);
					} else if (operation === 'update') {
						const assetId = this.getNodeParameter('assetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.tags) {
							body.tags = (updateFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter(Boolean);
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'PATCH',
								url: `${BASE_URL}/assets/${encodeURIComponent(assetId)}`,
								body,
								json: true,
							},
						);
					} else if (operation === 'upload') {
						const name = this.getNodeParameter('name', i) as string;
						const url = this.getNodeParameter('url', i) as string;
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						// 1. Create upload job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/url-asset-uploads`,
								body: { name, url },
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const uploadJobId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Asset upload job ${uploadJobId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/url-asset-uploads/${uploadJobId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(
								this.getNode(),
								`Asset upload job ${uploadJobId} failed`,
								{ itemIndex: i },
							);
						}

						responseData = jobResp;
					}
				}

				// ─── Autofill ──────────────────────────────────────────────────────
				else if (resource === 'autofill') {
					if (operation === 'create') {
						const brandTemplateId = this.getNodeParameter('brandTemplateId', i) as string;
						const dataRaw = this.getNodeParameter('data', i) as string | IDataObject;
						const title = this.getNodeParameter('title', i) as string;
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						let data: IDataObject;
						try {
							data = typeof dataRaw === 'string' ? (JSON.parse(dataRaw) as IDataObject) : dataRaw;
						} catch {
							throw new NodeOperationError(this.getNode(), 'The "Data" field is not valid JSON', {
								itemIndex: i,
							});
						}

						const body: IDataObject = { brand_template_id: brandTemplateId, data };
						if (title) body.title = title;

						// 1. Create autofill job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/autofills`,
								body,
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const autofillJobId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Autofill job ${autofillJobId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/autofills/${autofillJobId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(this.getNode(), `Autofill job ${autofillJobId} failed`, {
								itemIndex: i,
							});
						}

						responseData = jobResp;
					}
				}

				// ─── Brand Template ────────────────────────────────────────────────
				else if (resource === 'brandTemplate') {
					if (operation === 'get') {
						const brandTemplateId = this.getNodeParameter('brandTemplateId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/brand-templates/${encodeURIComponent(brandTemplateId)}`,
								json: true,
							},
						);
					} else if (operation === 'getDataset') {
						const brandTemplateId = this.getNodeParameter('brandTemplateId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/brand-templates/${encodeURIComponent(brandTemplateId)}/dataset`,
								json: true,
							},
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i) as number);
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = { limit };
						if (filters.query) qs.query = filters.query;
						if (filters.ownership) qs.ownership = filters.ownership;
						if (filters.sort_by) qs.sort_by = filters.sort_by;

						// Canva may return short pages (fewer than `limit` items plus a continuation
						// token), so always paginate: until the list ends (Return All) or until
						// enough items have been collected to honour the limit.
						const allItems: unknown[] = [];
						let continuation: string | undefined;
						do {
							if (continuation) qs.continuation = continuation;
							const resp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{ method: 'GET', url: `${BASE_URL}/brand-templates`, qs, json: true },
							)) as { items?: unknown[]; continuation?: string };
							allItems.push(...(resp.items ?? []));
							continuation = resp.continuation;
						} while (continuation && (returnAll || allItems.length < limit));
						responseData = returnAll ? allItems : allItems.slice(0, limit);
					} else if (operation === 'publish') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/brand-templates`,
								body: { design_id: designId },
								json: true,
							},
						);
					}
				}

				// ─── Comment ───────────────────────────────────────────────────────
				else if (resource === 'comment') {
					if (operation === 'createThread') {
						const designId = this.getNodeParameter('designId', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { message_plaintext: message };
						if (additionalFields.assignee_id) body.assignee_id = additionalFields.assignee_id;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/comments`,
								body,
								json: true,
							},
						);
					} else if (operation === 'createReply') {
						const designId = this.getNodeParameter('designId', i) as string;
						const threadId = this.getNodeParameter('threadId', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/comments/${encodeURIComponent(threadId)}/replies`,
								body: { message_plaintext: message },
								json: true,
							},
						);
					} else if (operation === 'getThread') {
						const designId = this.getNodeParameter('designId', i) as string;
						const threadId = this.getNodeParameter('threadId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/comments/${encodeURIComponent(threadId)}`,
								json: true,
							},
						);
					} else if (operation === 'getReply') {
						const designId = this.getNodeParameter('designId', i) as string;
						const threadId = this.getNodeParameter('threadId', i) as string;
						const replyId = this.getNodeParameter('replyId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/comments/${encodeURIComponent(threadId)}/replies/${encodeURIComponent(replyId)}`,
								json: true,
							},
						);
					} else if (operation === 'listReplies') {
						const designId = this.getNodeParameter('designId', i) as string;
						const threadId = this.getNodeParameter('threadId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i) as number);

						const qs: IDataObject = { limit };

						// Canva may return short pages (fewer than `limit` items plus a continuation
						// token), so always paginate: until the list ends (Return All) or until
						// enough items have been collected to honour the limit.
						const allItems: unknown[] = [];
						let continuation: string | undefined;
						do {
							if (continuation) qs.continuation = continuation;
							const resp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/comments/${encodeURIComponent(threadId)}/replies`,
									qs,
									json: true,
								},
							)) as { items?: unknown[]; continuation?: string };
							allItems.push(...(resp.items ?? []));
							continuation = resp.continuation;
						} while (continuation && (returnAll || allItems.length < limit));
						responseData = returnAll ? allItems : allItems.slice(0, limit);
					}
				}

				// ─── Design ────────────────────────────────────────────────────────
				else if (resource === 'design') {
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
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}`,
								json: true,
							},
						);
					} else if (operation === 'getDataset') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/dataset`,
								json: true,
							},
						);
					} else if (operation === 'getPages') {
						const designId = this.getNodeParameter('designId', i) as string;
						const offset = this.getNodeParameter('offset', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/pages`,
								qs: { offset, limit },
								json: true,
							},
						);
					} else if (operation === 'getExportFormats') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/designs/${encodeURIComponent(designId)}/export-formats`,
								json: true,
							},
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i) as number);
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = { limit };
						if (filters.query) qs.query = filters.query;
						if (filters.ownership) qs.ownership = filters.ownership;
						if (filters.sort_by) qs.sort_by = filters.sort_by;

						// Canva may return short pages (fewer than `limit` items plus a continuation
						// token), so always paginate: until the list ends (Return All) or until
						// enough items have been collected to honour the limit.
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
						} while (continuation && (returnAll || allItems.length < limit));
						responseData = returnAll ? allItems : allItems.slice(0, limit);
					}
				}

				// ─── Design Import ─────────────────────────────────────────────────
				else if (resource === 'designImport') {
					if (operation === 'createImport') {
						const url = this.getNodeParameter('url', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						// 1. Create URL import job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/url-imports`,
								body: { url, title },
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const importJobId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Design import job ${importJobId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/url-imports/${importJobId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(
								this.getNode(),
								`Design import job ${importJobId} failed`,
								{ itemIndex: i },
							);
						}

						responseData = jobResp;
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
						if (format === 'jpg') {
							exportFormat.quality = this.getNodeParameter('jpgQuality', i) as number;
						} else if (format === 'mp4') {
							exportFormat.quality = this.getNodeParameter('mp4Quality', i) as string;
						}
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
					} else if (operation === 'delete') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						await this.helpers.httpRequestWithAuthentication.call(this, 'canvaOAuth2Api', {
							method: 'DELETE',
							url: `${BASE_URL}/folders/${encodeURIComponent(folderId)}`,
							json: true,
						});
						responseData = { success: true };
					} else if (operation === 'get') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'GET',
								url: `${BASE_URL}/folders/${encodeURIComponent(folderId)}`,
								json: true,
							},
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

						// Canva may return short pages (fewer than `limit` items plus a continuation
						// token), so always paginate: until the list ends (Return All) or until
						// enough items have been collected to honour the limit.
						const allItems: unknown[] = [];
						let continuation: string | undefined;
						do {
							if (continuation) qs.continuation = continuation;
							const resp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/folders/${encodeURIComponent(folderId)}/items`,
									qs,
									json: true,
								},
							)) as { items?: unknown[]; continuation?: string };
							allItems.push(...(resp.items ?? []));
							continuation = resp.continuation;
						} while (continuation && (returnAll || allItems.length < limit));
						responseData = returnAll ? allItems : allItems.slice(0, limit);
					} else if (operation === 'moveItem') {
						const itemId = this.getNodeParameter('itemId', i) as string;
						const toFolderId = this.getNodeParameter('toFolderId', i) as string;
						await this.helpers.httpRequestWithAuthentication.call(this, 'canvaOAuth2Api', {
							method: 'POST',
							url: `${BASE_URL}/folders/move`,
							body: {
								item_id: itemId,
								to_folder_id: toFolderId,
							},
							json: true,
						});
						responseData = { success: true };
					} else if (operation === 'update') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'PATCH',
								url: `${BASE_URL}/folders/${encodeURIComponent(folderId)}`,
								body: { name },
								json: true,
							},
						);
					}
				}

				// ─── Merge ─────────────────────────────────────────────────────────
				else if (resource === 'merge') {
					if (operation === 'create') {
						const mergeType = this.getNodeParameter('mergeType', i) as string;
						const operationsRaw = this.getNodeParameter('operations', i) as string | IDataObject[];
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						let operations: IDataObject[];
						try {
							operations =
								typeof operationsRaw === 'string'
									? (JSON.parse(operationsRaw) as IDataObject[])
									: operationsRaw;
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'The "Operations" field is not valid JSON',
								{ itemIndex: i },
							);
						}

						const body: IDataObject = { type: mergeType, operations };

						if (mergeType === 'create_new_design') {
							const title = this.getNodeParameter('title', i) as string;
							body.title = title;
						} else {
							const designId = this.getNodeParameter('designId', i) as string;
							const optionalTitle = this.getNodeParameter('optionalTitle', i) as string;
							body.design_id = designId;
							if (optionalTitle) body.title = optionalTitle;
						}

						// 1. Create merge job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/merges`,
								body,
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const mergeJobId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Merge job ${mergeJobId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/merges/${mergeJobId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(this.getNode(), `Merge job ${mergeJobId} failed`, {
								itemIndex: i,
							});
						}

						responseData = jobResp;
					}
				}

				// ─── Resize ────────────────────────────────────────────────────────
				else if (resource === 'resize') {
					if (operation === 'create') {
						const designId = this.getNodeParameter('designId', i) as string;
						const designType = this.getNodeParameter('designType', i) as string;
						const pollInterval = this.getNodeParameter('pollInterval', i) as number;
						const maxWait = (this.getNodeParameter('maxWait', i) as number) * 1000;

						let design_type: IDataObject;
						if (designType === 'preset') {
							const presetName = this.getNodeParameter('presetName', i) as string;
							design_type = { type: 'preset', name: presetName };
						} else {
							const width = this.getNodeParameter('width', i) as number;
							const height = this.getNodeParameter('height', i) as number;
							design_type = { type: 'custom', width, height };
						}

						// 1. Create resize job
						const createResp = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{
								method: 'POST',
								url: `${BASE_URL}/resizes`,
								body: { design_id: designId, design_type },
								json: true,
							},
						)) as { job: { id: string; status: string } };

						const resizeJobId = createResp.job.id;

						// 2. Poll until done
						const deadline = Date.now() + maxWait;
						let jobResp = createResp;

						while (jobResp.job.status === 'in_progress') {
							if (Date.now() >= deadline) {
								throw new NodeOperationError(
									this.getNode(),
									`Resize job ${resizeJobId} timed out after ${maxWait / 1000}s`,
									{ itemIndex: i },
								);
							}
							await sleep(pollInterval);
							jobResp = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'canvaOAuth2Api',
								{
									method: 'GET',
									url: `${BASE_URL}/resizes/${resizeJobId}`,
									json: true,
								},
							)) as { job: { id: string; status: string } };
						}

						if (jobResp.job.status === 'failed') {
							throw new NodeOperationError(this.getNode(), `Resize job ${resizeJobId} failed`, {
								itemIndex: i,
							});
						}

						responseData = jobResp;
					}
				}

				// ─── User ──────────────────────────────────────────────────────────
				else if (resource === 'user') {
					if (operation === 'getCapabilities') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaOAuth2Api',
							{ method: 'GET', url: `${BASE_URL}/users/me/capabilities`, json: true },
						);
					} else if (operation === 'getMe') {
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

				// Error handling
				if (responseData === undefined) {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation "${operation}" for resource "${resource}"`,
						{ itemIndex: i },
					);
				}

				if (Array.isArray(responseData)) {
					returnData.push(
						...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						),
					);
				} else {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}

				// Both constructors return the original error unchanged when passed their
				// own type, so no context is lost here.
				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

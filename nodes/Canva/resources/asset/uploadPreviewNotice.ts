import type { INodeProperties } from 'n8n-workflow';

export const assetUploadPreviewNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'⚠️ Preview API: This operation may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.',
		name: 'assetUploadPreviewNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['asset'], operation: ['upload'] } },
	},
];

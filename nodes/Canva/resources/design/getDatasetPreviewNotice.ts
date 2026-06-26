import type { INodeProperties } from 'n8n-workflow';

export const designGetDatasetPreviewNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'⚠️ Preview API: This operation may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.',
		name: 'designGetDatasetPreviewNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['design'], operation: ['getDataset'] } },
	},
];

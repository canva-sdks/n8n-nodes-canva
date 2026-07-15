import type { INodeProperties } from 'n8n-workflow';

export const designGetPagesPreviewNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'⚠️ Preview API: This operation may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.',
		name: 'designGetPagesPreviewNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['design'], operation: ['getPages'] } },
	},
];

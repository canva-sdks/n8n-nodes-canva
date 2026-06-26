import type { INodeProperties } from 'n8n-workflow';

export const brandTemplatePublishPreviewNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'⚠️ Preview API: This operation may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.',
		name: 'brandTemplatePublishPreviewNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['brandTemplate'], operation: ['publish'] } },
	},
];

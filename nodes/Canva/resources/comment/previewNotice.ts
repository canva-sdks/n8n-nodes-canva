import type { INodeProperties } from 'n8n-workflow';

export const commentPreviewNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'⚠️ Preview API: These operations may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.',
		name: 'commentPreviewNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['comment'] } },
	},
];

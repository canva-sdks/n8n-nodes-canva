import type { INodeProperties } from 'n8n-workflow';

export const designImportCreateImageImportCreditsNoticeDescription: INodeProperties[] = [
	{
		displayName:
			"✨ Uses AI credits: Each Magic Layers import uses the user's Canva AI credits, and Magic Layers must be allowed in the user's team permissions.",
		name: 'designImportCreateImageImportCreditsNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['designImport'], operation: ['createImageImport'] } },
	},
];

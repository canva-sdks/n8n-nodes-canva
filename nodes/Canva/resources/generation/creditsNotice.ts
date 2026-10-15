import type { INodeProperties } from 'n8n-workflow';

export const generationCreditsNoticeDescription: INodeProperties[] = [
	{
		displayName: "✨ Uses AI credits: Each generation job uses the user's Canva AI credits.",
		name: 'generationCreditsNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['generation'] } },
	},
];

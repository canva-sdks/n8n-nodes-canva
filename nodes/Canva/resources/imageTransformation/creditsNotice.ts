import type { INodeProperties } from 'n8n-workflow';

export const imageTransformationCreditsNoticeDescription: INodeProperties[] = [
	{
		displayName:
			"✨ Uses AI credits: Each image transformation job uses the user's Canva AI credits.",
		name: 'imageTransformationCreditsNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['imageTransformation'] } },
	},
];

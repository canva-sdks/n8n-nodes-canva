import type { INodeProperties } from 'n8n-workflow';

export const imageTransformationPremiumNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'💎 Canva Pro required: Background removal requires a Canva plan with premium features (such as Canva Pro).',
		name: 'imageTransformationPremiumNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['imageTransformation'] } },
	},
];

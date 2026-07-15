import type { INodeProperties } from 'n8n-workflow';

export const brandTemplatePremiumNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'💎 Premium plan required: The Brand Template APIs require a Canva plan with premium features (such as Canva Pro).',
		name: 'brandTemplatePremiumNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['brandTemplate'] } },
	},
];

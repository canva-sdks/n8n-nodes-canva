import type { INodeProperties } from 'n8n-workflow';

export const resizePremiumNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'💎 Canva Pro required: The Resize API requires a Canva plan with premium features (such as Canva Pro). Users on the Canva Free plan have access to a limited trial.',
		name: 'resizePremiumNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['resize'] } },
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const autofillPremiumNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'💎 Canva Pro required: The Autofill API can only be used on behalf of users on a Canva Pro plan or above.',
		name: 'autofillPremiumNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['autofill'] } },
	},
];

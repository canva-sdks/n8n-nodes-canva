import type { INodeProperties } from 'n8n-workflow';

export const autofillPremiumNoticeDescription: INodeProperties[] = [
	{
		displayName:
			'💎 Canva Enterprise required: The Autofill API can only be used on behalf of users who are members of a Canva Enterprise organization.',
		name: 'autofillPremiumNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['autofill'] } },
	},
];

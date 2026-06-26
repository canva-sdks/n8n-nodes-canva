import type { INodeProperties } from 'n8n-workflow';

export const brandTemplateGetDescription: INodeProperties[] = [
	{
		displayName: 'Brand Template ID',
		name: 'brandTemplateId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['brandTemplate'], operation: ['get'] } },
		description: 'The ID of the brand template to retrieve',
		placeholder: 'DAFVztcvd9z',
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const brandTemplateGetDatasetDescription: INodeProperties[] = [
	{
		displayName: 'Brand Template ID',
		name: 'brandTemplateId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['brandTemplate'], operation: ['getDataset'] } },
		description: 'The ID of the brand template to get the autofill dataset for',
		placeholder: 'DAFVztcvd9z',
	},
];

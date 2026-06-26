import type { INodeProperties } from 'n8n-workflow';

export const designGetDatasetDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['design'], operation: ['getDataset'] } },
		description: 'The ID of the design to get the autofill dataset for',
		placeholder: 'DAFVztcvd9z',
	},
];

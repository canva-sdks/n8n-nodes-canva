import type { INodeProperties } from 'n8n-workflow';

export const designGetPagesDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['design'], operation: ['getPages'] } },
		description: 'The ID of the design to get pages for',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 500 },
		default: 1,
		displayOptions: { show: { resource: ['design'], operation: ['getPages'] } },
		description: 'Page index of the first page to return (1-based)',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 200 },
		default: 50,
		displayOptions: { show: { resource: ['design'], operation: ['getPages'] } },
		description: 'Max number of results to return',
	},
];

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
];

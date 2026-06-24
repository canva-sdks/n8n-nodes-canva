import type { INodeProperties } from 'n8n-workflow';

export const designGetDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['design'], operation: ['get'] } },
		description: 'The ID of the design to retrieve',
		placeholder: 'DAFVztcvd9z',
	},
];

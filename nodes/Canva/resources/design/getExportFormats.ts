import type { INodeProperties } from 'n8n-workflow';

export const designGetExportFormatsDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['design'], operation: ['getExportFormats'] } },
		description: 'The ID of the design to get available export formats for',
		placeholder: 'DAFVztcvd9z',
	},
];

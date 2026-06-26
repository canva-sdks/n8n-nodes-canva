import type { INodeProperties } from 'n8n-workflow';

export const designImportCreateImportDescription: INodeProperties[] = [
	{
		displayName: 'File URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImport'] } },
		description: 'Publicly accessible URL of the file to import into Canva',
		placeholder: 'https://example.com/presentation.pptx',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImport'] } },
		description: 'Title for the imported design (max 255 characters)',
		placeholder: 'Q4 Presentation',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 3000,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImport'] } },
		description: 'How often to check if the import job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 600 },
		default: 120,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImport'] } },
		description: 'Maximum time to wait for the import to complete before timing out',
	},
];

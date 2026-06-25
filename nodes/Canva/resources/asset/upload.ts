import type { INodeProperties } from 'n8n-workflow';

export const assetUploadDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['upload'] } },
		description: 'Name for the uploaded asset (max 255 characters)',
		placeholder: 'My Awesome Asset',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['upload'] } },
		description: 'Publicly accessible URL of the file to upload. Videos are limited to 100MB.',
		placeholder: 'https://example.com/image.jpg',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 2000,
		displayOptions: { show: { resource: ['asset'], operation: ['upload'] } },
		description: 'How often to check if the upload job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 300 },
		default: 60,
		displayOptions: { show: { resource: ['asset'], operation: ['upload'] } },
		description: 'Maximum time to wait for the upload to complete before timing out',
	},
];

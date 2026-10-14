import type { INodeProperties } from 'n8n-workflow';

export const designImportCreateImageImportDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImageImport'] } },
		description:
			'ID of the image asset to turn into an editable design. Works best with flat graphics such as posters, flyers, and banners. Vector images (SVG, EPS, AI) and videos are not supported.',
		placeholder: 'Msd59349ff',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['designImport'], operation: ['createImageImport'] } },
		description:
			'Title for the new design (max 255 characters). If left empty, Canva generates one.',
		placeholder: 'Summer Sale Poster',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 3000,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImageImport'] } },
		description: 'How often to check if the import job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 600 },
		default: 120,
		displayOptions: { show: { resource: ['designImport'], operation: ['createImageImport'] } },
		description: 'Maximum time to wait for the import to complete before timing out',
	},
];

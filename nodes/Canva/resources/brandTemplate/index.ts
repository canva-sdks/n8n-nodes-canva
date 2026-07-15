import type { INodeProperties } from 'n8n-workflow';
import { brandTemplateGetDescription } from './get';
import { brandTemplateGetAllDescription } from './getAll';
import { brandTemplateGetDatasetDescription } from './getDataset';
import { brandTemplatePublishDescription } from './publish';
import { brandTemplatePublishPreviewNoticeDescription } from './publishPreviewNotice';

export const brandTemplateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['brandTemplate'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the metadata for a brand template',
				action: 'Get a brand template',
			},
			{
				name: 'Get Dataset',
				value: 'getDataset',
				description: 'Get the autofill dataset for a brand template',
				action: 'Get brand template dataset',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: "Get many of the user's brand templates",
				action: 'Get many brand templates',
			},
			{
				name: 'Publish (Preview)',
				value: 'publish',
				description: 'Publish a design as a brand template',
				action: 'Publish a brand template',
			},
		],
		default: 'getAll',
	},
];

export const brandTemplateDescription: INodeProperties[] = [
	...brandTemplateOperations,
	...brandTemplateGetDescription,
	...brandTemplateGetDatasetDescription,
	...brandTemplateGetAllDescription,
	...brandTemplatePublishPreviewNoticeDescription,
	...brandTemplatePublishDescription,
];

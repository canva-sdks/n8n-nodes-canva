import type { INodeProperties } from 'n8n-workflow';
import { brandTemplateGetDescription } from './get';
import { brandTemplateGetDatasetDescription } from './getDataset';
import { brandTemplateListDescription } from './list';
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
				name: 'List',
				value: 'list',
				description: "List the user's brand templates",
				action: 'List brand templates',
			},
			{
				name: 'Publish (Preview)',
				value: 'publish',
				description: 'Publish a design as a brand template',
				action: 'Publish a brand template',
			},
		],
		default: 'list',
	},
];

export const brandTemplateDescription: INodeProperties[] = [
	...brandTemplateOperations,
	...brandTemplateGetDescription,
	...brandTemplateGetDatasetDescription,
	...brandTemplateListDescription,
	...brandTemplatePublishPreviewNoticeDescription,
	...brandTemplatePublishDescription,
];

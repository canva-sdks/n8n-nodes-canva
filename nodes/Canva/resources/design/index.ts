import type { INodeProperties } from 'n8n-workflow';
import { designCreateDescription } from './create';
import { designGetDescription } from './get';
import { designGetDatasetDescription } from './getDataset';
import { designGetDatasetPreviewNoticeDescription } from './getDatasetPreviewNotice';
import { designGetAllDescription } from './getAll';
import { designGetExportFormatsDescription } from './getExportFormats';
import { designGetPagesDescription } from './getPages';

export const designOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['design'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new design',
				action: 'Create a design',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get metadata for a design',
				action: 'Get a design',
			},
			{
				name: 'Get Dataset (Preview)',
				value: 'getDataset',
				description: 'Get the autofill dataset for a design',
				action: 'Get design dataset',
			},
			{
				name: 'Get Export Formats',
				value: 'getExportFormats',
				description: 'Get the available export formats for a design',
				action: 'Get design export formats',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: "Get many designs from the user's projects",
				action: 'Get many designs',
			},
			{
				name: 'Get Pages',
				value: 'getPages',
				description: 'Get metadata for pages in a design',
				action: 'Get design pages',
			},
		],
		default: 'create',
	},
];

export const designDescription: INodeProperties[] = [
	...designOperations,
	...designCreateDescription,
	...designGetDescription,
	...designGetDatasetPreviewNoticeDescription,
	...designGetDatasetDescription,
	...designGetExportFormatsDescription,
	...designGetPagesDescription,
	...designGetAllDescription,
];

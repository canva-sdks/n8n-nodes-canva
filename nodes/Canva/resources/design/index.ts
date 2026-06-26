import type { INodeProperties } from 'n8n-workflow';
import { designCreateDescription } from './create';
import { designGetDescription } from './get';
import { designGetExportFormatsDescription } from './getExportFormats';
import { designGetPagesDescription } from './getPages';
import { designListDescription } from './list';

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
				name: 'Get Export Formats',
				value: 'getExportFormats',
				description: 'Get the available export formats for a design',
				action: 'Get design export formats',
			},
			{
				name: 'Get Pages',
				value: 'getPages',
				description: 'Get metadata for pages in a design',
				action: 'Get design pages',
			},
			{
				name: 'List',
				value: 'list',
				description: "List designs in the user's projects",
				action: 'List designs',
			},
		],
		default: 'create',
	},
];

export const designDescription: INodeProperties[] = [
	...designOperations,
	...designCreateDescription,
	...designGetDescription,
	...designGetExportFormatsDescription,
	...designGetPagesDescription,
	...designListDescription,
];

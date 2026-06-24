import type { INodeProperties } from 'n8n-workflow';
import { designCreateDescription } from './create';
import { designGetDescription } from './get';
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
	...designListDescription,
];

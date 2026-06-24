import type { INodeProperties } from 'n8n-workflow';
import { folderCreateDescription } from './create';
import { folderGetDescription } from './get';
import { folderListItemsDescription } from './listItems';

export const folderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['folder'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new folder',
				action: 'Create a folder',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a folder',
				action: 'Get a folder',
			},
			{
				name: 'List Items',
				value: 'listItems',
				description: 'List items in a folder',
				action: 'List folder items',
			},
		],
		default: 'listItems',
	},
];

export const folderDescription: INodeProperties[] = [
	...folderOperations,
	...folderCreateDescription,
	...folderGetDescription,
	...folderListItemsDescription,
];

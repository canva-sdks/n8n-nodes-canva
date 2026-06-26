import type { INodeProperties } from 'n8n-workflow';
import { folderCreateDescription } from './create';
import { folderDeleteDescription } from './delete';
import { folderGetDescription } from './get';
import { folderListItemsDescription } from './listItems';
import { folderMoveItemDescription } from './moveItem';
import { folderUpdateDescription } from './update';

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
				name: 'Delete',
				value: 'delete',
				description: 'Delete a folder',
				action: 'Delete a folder',
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
			{
				name: 'Move Item',
				value: 'moveItem',
				description: 'Move an item to a different folder',
				action: 'Move a folder item',
			},
			{
				name: 'Update',
				value: 'update',
				description: "Update a folder's metadata",
				action: 'Update a folder',
			},
		],
		default: 'listItems',
	},
];

export const folderDescription: INodeProperties[] = [
	...folderOperations,
	...folderCreateDescription,
	...folderDeleteDescription,
	...folderGetDescription,
	...folderListItemsDescription,
	...folderMoveItemDescription,
	...folderUpdateDescription,
];

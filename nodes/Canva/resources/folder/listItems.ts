import type { INodeProperties } from 'n8n-workflow';

export const folderListItemsDescription: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['listItems'] } },
		description: 'The ID of the folder to list items from',
		placeholder: 'FAF2lZtloor',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['folder'], operation: ['listItems'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		displayOptions: {
			show: { resource: ['folder'], operation: ['listItems'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['folder'], operation: ['listItems'] } },
		options: [
			{
				displayName: 'Item Types',
				name: 'item_types',
				type: 'multiOptions',
				options: [
					{ name: 'Design', value: 'design' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Image', value: 'image' },
				],
				default: [],
				description: 'Filter results by item type',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				options: [
					{ name: 'Title (A–Z)', value: 'title_ascending' },
					{ name: 'Title (Z–A)', value: 'title_descending' },
					{ name: 'Modified (Newest First)', value: 'modified_descending' },
					{ name: 'Modified (Oldest First)', value: 'modified_ascending' },
				],
				default: 'title_ascending',
				description: 'Sort order for the items',
			},
		],
	},
];

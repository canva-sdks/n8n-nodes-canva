import type { INodeProperties } from 'n8n-workflow';

export const designGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['design'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		displayOptions: {
			show: { resource: ['design'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['design'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Ownership',
				name: 'ownership',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any', description: 'Owned by and shared with the user' },
					{ name: 'Owned', value: 'owned', description: 'Owned by the user' },
					{ name: 'Shared', value: 'shared', description: 'Shared with the user' },
				],
				default: 'any',
				description: 'Filter designs by ownership',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search term to filter designs by name',
				placeholder: 'party invites',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				options: [
					{ name: 'Modified (Newest First)', value: 'modified_descending' },
					{ name: 'Modified (Oldest First)', value: 'modified_ascending' },
					{ name: 'Relevance', value: 'relevance' },
					{ name: 'Title (A–Z)', value: 'title_ascending' },
					{ name: 'Title (Z–A)', value: 'title_descending' },
				],
				default: 'relevance',
				description: 'Sort order for the results',
			},
		],
	},
];

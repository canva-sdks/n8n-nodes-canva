import type { INodeProperties } from 'n8n-workflow';

export const assetUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['update'] } },
		description: 'The ID of the asset to update',
		placeholder: 'Msd59349ff',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['asset'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the asset (max 50 characters)',
				placeholder: 'My Updated Asset',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to assign to the asset (max 50 tags)',
				placeholder: 'logo,brand,2024',
			},
		],
	},
];

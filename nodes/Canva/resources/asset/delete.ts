import type { INodeProperties } from 'n8n-workflow';

export const assetDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['delete'] } },
		description: 'The ID of the asset to delete',
		placeholder: 'Msd59349ff',
	},
];

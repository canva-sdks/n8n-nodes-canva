import type { INodeProperties } from 'n8n-workflow';

export const assetGetDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['get'] } },
		description: 'The ID of the asset to retrieve',
		placeholder: 'Msd59349ff',
	},
];

import type { INodeProperties } from 'n8n-workflow';
import { assetGetDescription } from './get';

export const assetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['asset'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get metadata for an asset',
				action: 'Get an asset',
			},
		],
		default: 'get',
	},
];

export const assetDescription: INodeProperties[] = [...assetOperations, ...assetGetDescription];

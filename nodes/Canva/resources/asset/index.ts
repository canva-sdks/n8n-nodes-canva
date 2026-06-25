import type { INodeProperties } from 'n8n-workflow';
import { assetGetDescription } from './get';
import { assetUploadDescription } from './upload';

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
			{
				name: 'Upload From URL',
				value: 'upload',
				description: 'Upload an asset to Canva from a public URL',
				action: 'Upload an asset from URL',
			},
		],
		default: 'get',
	},
];

export const assetDescription: INodeProperties[] = [
	...assetOperations,
	...assetGetDescription,
	...assetUploadDescription,
];

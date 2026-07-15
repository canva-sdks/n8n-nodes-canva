import type { INodeProperties } from 'n8n-workflow';
import { assetDeleteDescription } from './delete';
import { assetGetDescription } from './get';
import { assetUpdateDescription } from './update';
import { assetUploadDescription } from './upload';
import { assetUploadPreviewNoticeDescription } from './uploadPreviewNotice';

export const assetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['asset'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: "Delete an asset from the user's projects",
				action: 'Delete an asset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get metadata for an asset',
				action: 'Get an asset',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the metadata for an asset',
				action: 'Update an asset',
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
	...assetDeleteDescription,
	...assetGetDescription,
	...assetUpdateDescription,
	...assetUploadPreviewNoticeDescription,
	...assetUploadDescription,
];

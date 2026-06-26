import type { INodeProperties } from 'n8n-workflow';

export const folderMoveItemDescription: INodeProperties[] = [
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['moveItem'] } },
		description: 'The ID of the item (design, folder, or asset) to move',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'To Folder ID',
		name: 'toFolderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['moveItem'] } },
		description:
			'The ID of the destination folder. Use "root" for the top-level projects folder.',
		placeholder: 'FAF2lZtloor',
	},
];

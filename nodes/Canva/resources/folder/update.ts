import type { INodeProperties } from 'n8n-workflow';

export const folderUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
		description: 'The ID of the folder to update',
		placeholder: 'FAF2lZtloor',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
		description: 'New name for the folder (max 255 characters)',
		placeholder: 'My Renamed Folder',
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const folderDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['delete'] } },
		description: 'The ID of the folder to delete',
		placeholder: 'FAF2lZtloor',
	},
];

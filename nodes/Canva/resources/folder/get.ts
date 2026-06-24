import type { INodeProperties } from 'n8n-workflow';

export const folderGetDescription: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['get'] } },
		description: 'The ID of the folder to retrieve',
		placeholder: 'FAF2lZtloor',
	},
];

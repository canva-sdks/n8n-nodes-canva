import type { INodeProperties } from 'n8n-workflow';

export const folderCreateDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
		description: 'Name of the new folder',
		placeholder: 'My Folder',
	},
	{
		displayName: 'Parent Folder ID',
		name: 'parentFolderId',
		type: 'string',
		default: 'root',
		required: true,
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
		description:
			'ID of the parent folder. Use "root" for the top-level projects, or "uploads" for the uploads folder.',
		placeholder: 'root',
	},
];

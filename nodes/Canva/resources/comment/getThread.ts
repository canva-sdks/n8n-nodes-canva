import type { INodeProperties } from 'n8n-workflow';

export const commentGetThreadDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['getThread'] } },
		description: 'The ID of the design containing the comment thread',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['getThread'] } },
		description: 'The ID of the comment thread to retrieve',
		placeholder: 'FeXxxxxx5N',
	},
];

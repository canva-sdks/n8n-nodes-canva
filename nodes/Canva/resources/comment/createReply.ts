import type { INodeProperties } from 'n8n-workflow';

export const commentCreateReplyDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['createReply'] } },
		description: 'The ID of the design containing the comment thread',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['createReply'] } },
		description: 'The ID of the comment thread to reply to',
		placeholder: 'FeXxxxxx5N',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['createReply'] } },
		description: 'The text content of the reply',
		placeholder: 'Done, updated the font!',
		typeOptions: { rows: 3 },
	},
];

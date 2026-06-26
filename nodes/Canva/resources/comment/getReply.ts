import type { INodeProperties } from 'n8n-workflow';

export const commentGetReplyDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['getReply'] } },
		description: 'The ID of the design containing the comment thread',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['getReply'] } },
		description: 'The ID of the parent comment thread',
		placeholder: 'FeXxxxxx5N',
	},
	{
		displayName: 'Reply ID',
		name: 'replyId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['getReply'] } },
		description: 'The ID of the reply to retrieve',
		placeholder: 'FeXxxxxx6N',
	},
];

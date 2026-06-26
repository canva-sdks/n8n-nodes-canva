import type { INodeProperties } from 'n8n-workflow';
import { commentCreateReplyDescription } from './createReply';
import { commentCreateThreadDescription } from './createThread';
import { commentGetReplyDescription } from './getReply';
import { commentGetThreadDescription } from './getThread';
import { commentListRepliesDescription } from './listReplies';
import { commentPreviewNoticeDescription } from './previewNotice';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['comment'] } },
		options: [
			{
				name: 'Create Reply (Preview)',
				value: 'createReply',
				description: 'Reply to a comment thread on a design',
				action: 'Create a comment reply',
			},
			{
				name: 'Create Thread (Preview)',
				value: 'createThread',
				description: 'Create a new comment thread on a design',
				action: 'Create a comment thread',
			},
			{
				name: 'Get Reply (Preview)',
				value: 'getReply',
				description: 'Get a specific reply from a comment thread',
				action: 'Get a comment reply',
			},
			{
				name: 'Get Thread (Preview)',
				value: 'getThread',
				description: 'Get metadata for a comment thread',
				action: 'Get a comment thread',
			},
			{
				name: 'List Replies (Preview)',
				value: 'listReplies',
				description: 'List all replies for a comment thread',
				action: 'List comment replies',
			},
		],
		default: 'createThread',
	},
];

export const commentDescription: INodeProperties[] = [
	...commentOperations,
	...commentPreviewNoticeDescription,
	...commentCreateReplyDescription,
	...commentCreateThreadDescription,
	...commentGetReplyDescription,
	...commentGetThreadDescription,
	...commentListRepliesDescription,
];

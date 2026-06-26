import type { INodeProperties } from 'n8n-workflow';

export const commentListRepliesDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['listReplies'] } },
		description: 'The ID of the design containing the comment thread',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['listReplies'] } },
		description: 'The ID of the comment thread to list replies for',
		placeholder: 'FeXxxxxx5N',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['comment'], operation: ['listReplies'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		displayOptions: {
			show: { resource: ['comment'], operation: ['listReplies'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];

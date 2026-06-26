import type { INodeProperties } from 'n8n-workflow';

export const commentCreateThreadDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['createThread'] } },
		description: 'The ID of the design to create a comment thread on',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['comment'], operation: ['createThread'] } },
		description: 'The text content of the comment',
		placeholder: 'Looks great! Can we adjust the font?',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['createThread'] } },
		options: [
			{
				displayName: 'Assignee User ID',
				name: 'assignee_id',
				type: 'string',
				default: '',
				description: 'The user ID to assign this comment thread to',
				placeholder: 'Uabcd1234',
			},
		],
	},
];

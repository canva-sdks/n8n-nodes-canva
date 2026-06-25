import type { INodeProperties } from 'n8n-workflow';

export const autofillCreateDescription: INodeProperties[] = [
	{
		displayName: 'Brand Template ID',
		name: 'brandTemplateId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['autofill'], operation: ['create'] } },
		description: 'The ID of the brand template to autofill from',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: { show: { resource: ['autofill'], operation: ['create'] } },
		description:
			'Object mapping brand template field names to their values. Text field example: <code>{"headline": {"type": "text", "text": "Hello"}}</code>. Image field example: <code>{"photo": {"type": "image", "asset_id": "Msd59349ff"}}</code>.',
		typeOptions: { rows: 5 },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['autofill'], operation: ['create'] } },
		description: 'Title for the autofilled design (max 255 characters)',
		placeholder: 'My Autofilled Design',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 2000,
		displayOptions: { show: { resource: ['autofill'], operation: ['create'] } },
		description: 'How often to check if the autofill job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 300 },
		default: 60,
		displayOptions: { show: { resource: ['autofill'], operation: ['create'] } },
		description: 'Maximum time to wait for the autofill to complete before timing out',
	},
];

import type { INodeProperties } from 'n8n-workflow';
import { autofillCreateDescription } from './create';

export const autofillOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['autofill'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Autofill a design from a brand template',
				action: 'Create an autofill job',
			},
		],
		default: 'create',
	},
];

export const autofillDescription: INodeProperties[] = [
	...autofillOperations,
	...autofillCreateDescription,
];

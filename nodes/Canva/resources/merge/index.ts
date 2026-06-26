import type { INodeProperties } from 'n8n-workflow';
import { mergeCreateDescription } from './create';

export const mergeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['merge'] } },
		options: [
			{
				name: 'Create Merge Job',
				value: 'create',
				description:
					'Merge design pages by applying page operations to create or modify a design (waits for the job to complete)',
				action: 'Create a design merge job',
			},
		],
		default: 'create',
	},
];

export const mergeDescription: INodeProperties[] = [
	...mergeOperations,
	...mergeCreateDescription,
];

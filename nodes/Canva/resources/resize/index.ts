import type { INodeProperties } from 'n8n-workflow';
import { resizeCreateDescription } from './create';

export const resizeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['resize'] } },
		options: [
			{
				name: 'Create Resize Job',
				value: 'create',
				description:
					'Create a resized copy of a design in new dimensions or format (waits for the job to complete)',
				action: 'Create a design resize job',
			},
		],
		default: 'create',
	},
];

export const resizeDescription: INodeProperties[] = [
	...resizeOperations,
	...resizeCreateDescription,
];

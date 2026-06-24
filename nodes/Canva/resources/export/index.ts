import type { INodeProperties } from 'n8n-workflow';
import { exportExportDescription } from './export';

export const exportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['export'] } },
		options: [
			{
				name: 'Export Design',
				value: 'export',
				description: 'Export a design to a file (waits for the job to complete)',
				action: 'Export a design',
			},
		],
		default: 'export',
	},
];

export const exportDescription: INodeProperties[] = [
	...exportOperations,
	...exportExportDescription,
];

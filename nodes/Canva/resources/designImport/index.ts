import type { INodeProperties } from 'n8n-workflow';
import { designImportCreateImportDescription } from './createImport';

export const designImportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['designImport'] } },
		options: [
			{
				name: 'Import From URL',
				value: 'createImport',
				description:
					'Import a design from another application into Canva using a public URL (waits for the job to complete)',
				action: 'Import a design from URL',
			},
		],
		default: 'createImport',
	},
];

export const designImportDescription: INodeProperties[] = [
	...designImportOperations,
	...designImportCreateImportDescription,
];

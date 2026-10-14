import type { INodeProperties } from 'n8n-workflow';
import { designImportCreateImageImportDescription } from './createImageImport';
import { designImportCreateImageImportCreditsNoticeDescription } from './createImageImportCreditsNotice';
import { designImportCreateImageImportPreviewNoticeDescription } from './createImageImportPreviewNotice';
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
				name: 'Import From Image (Preview)',
				value: 'createImageImport',
				description:
					'Turn a flat image asset into an editable design using Magic Layers (waits for the job to complete)',
				action: 'Import a design from an image',
			},
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
	...designImportCreateImageImportPreviewNoticeDescription,
	...designImportCreateImageImportCreditsNoticeDescription,
	...designImportCreateImageImportDescription,
	...designImportCreateImportDescription,
];

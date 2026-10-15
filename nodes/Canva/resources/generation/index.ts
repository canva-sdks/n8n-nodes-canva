import type { INodeProperties } from 'n8n-workflow';
import { generationCreditsNoticeDescription } from './creditsNotice';
import { generationGenerateDesignDescription } from './generateDesign';
import { generationPreviewNoticeDescription } from './previewNotice';

export const generationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['generation'] } },
		options: [
			{
				name: 'Generate Design (Preview)',
				value: 'generateDesign',
				description:
					'Generate a presentation or Canva doc from a brief using AI (waits for the job to complete)',
				action: 'Generate a design',
			},
		],
		default: 'generateDesign',
	},
];

export const generationDescription: INodeProperties[] = [
	...generationOperations,
	...generationPreviewNoticeDescription,
	...generationCreditsNoticeDescription,
	...generationGenerateDesignDescription,
];

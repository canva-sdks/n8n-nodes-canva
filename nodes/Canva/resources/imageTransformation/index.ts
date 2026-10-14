import type { INodeProperties } from 'n8n-workflow';
import { imageTransformationCreditsNoticeDescription } from './creditsNotice';
import { imageTransformationPremiumNoticeDescription } from './premiumNotice';
import { imageTransformationPreviewNoticeDescription } from './previewNotice';
import { imageTransformationRemoveBackgroundDescription } from './removeBackground';

export const imageTransformationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['imageTransformation'] } },
		options: [
			{
				name: 'Remove Background (Preview)',
				value: 'removeBackground',
				description:
					'Remove the background from an image asset and save the result as a new asset (waits for the job to complete)',
				action: 'Remove the background from an image',
			},
		],
		default: 'removeBackground',
	},
];

export const imageTransformationDescription: INodeProperties[] = [
	...imageTransformationOperations,
	...imageTransformationPreviewNoticeDescription,
	...imageTransformationPremiumNoticeDescription,
	...imageTransformationCreditsNoticeDescription,
	...imageTransformationRemoveBackgroundDescription,
];

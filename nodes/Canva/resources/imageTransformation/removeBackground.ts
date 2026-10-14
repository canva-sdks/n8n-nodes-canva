import type { INodeProperties } from 'n8n-workflow';

export const imageTransformationRemoveBackgroundDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['imageTransformation'], operation: ['removeBackground'] },
		},
		description:
			'ID of the image asset to remove the background from. The asset must have finished uploading. Images larger than 10 megapixels are scaled down.',
		placeholder: 'Msd59349ff',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['imageTransformation'], operation: ['removeBackground'] },
		},
		description:
			"Name for the new asset (max 255 characters). If left empty, the original asset's name is used.",
		placeholder: 'Product Photo (No Background)',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 2000,
		displayOptions: {
			show: { resource: ['imageTransformation'], operation: ['removeBackground'] },
		},
		description: 'How often to check if the background removal job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 300 },
		default: 60,
		displayOptions: {
			show: { resource: ['imageTransformation'], operation: ['removeBackground'] },
		},
		description: 'Maximum time to wait for the background removal to complete before timing out',
	},
];

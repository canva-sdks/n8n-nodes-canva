import type { INodeProperties } from 'n8n-workflow';

export const designCreateDescription: INodeProperties[] = [
	{
		displayName: 'Design Type',
		name: 'designType',
		type: 'options',
		options: [
			{ name: 'Preset', value: 'preset', description: 'Use a predefined design type' },
			{ name: 'Custom Size', value: 'custom', description: 'Specify width and height in pixels' },
		],
		default: 'preset',
		required: true,
		displayOptions: { show: { resource: ['design'], operation: ['create'] } },
		description: 'How to define the design type',
	},
	{
		displayName: 'Preset Type',
		name: 'presetName',
		type: 'options',
		options: [
			{ name: 'Document', value: 'doc' },
			{ name: 'Email', value: 'email' },
			{ name: 'Presentation', value: 'presentation' },
			{ name: 'Whiteboard', value: 'whiteboard' },
		],
		default: 'presentation',
		required: true,
		displayOptions: {
			show: { resource: ['design'], operation: ['create'], designType: ['preset'] },
		},
		description: 'The preset design type to use',
	},
	{
		displayName: 'Width (Px)',
		name: 'width',
		type: 'number',
		typeOptions: { minValue: 40, maxValue: 8000 },
		default: 800,
		required: true,
		displayOptions: {
			show: { resource: ['design'], operation: ['create'], designType: ['custom'] },
		},
		description: 'Width of the custom design in pixels',
	},
	{
		displayName: 'Height (Px)',
		name: 'height',
		type: 'number',
		typeOptions: { minValue: 40, maxValue: 8000 },
		default: 600,
		required: true,
		displayOptions: {
			show: { resource: ['design'], operation: ['create'], designType: ['custom'] },
		},
		description: 'Height of the custom design in pixels',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['design'], operation: ['create'] } },
		description: 'Name of the new design (max 255 characters)',
		placeholder: 'My Holiday Presentation',
	},
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['design'], operation: ['create'] } },
		description: 'ID of an image asset to insert into the new design',
		placeholder: 'Msd59349ff',
	},
];

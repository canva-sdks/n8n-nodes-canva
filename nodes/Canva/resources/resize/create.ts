import type { INodeProperties } from 'n8n-workflow';

export const resizeCreateDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['resize'], operation: ['create'] } },
		description: 'The ID of the design to resize',
		placeholder: 'DAFVztcvd9z',
	},
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
		displayOptions: { show: { resource: ['resize'], operation: ['create'] } },
		description: 'How to define the target design type for the resized copy',
	},
	{
		displayName: 'Preset Type',
		name: 'presetName',
		type: 'options',
		options: [
			// Note: the API's shared preset enum also includes 'doc' and 'email', but the
			// Resize endpoint rejects them — designs can't be resized to (or from) Canva
			// docs and emails. See https://www.canva.dev/docs/connect/api-reference/resizes/create-design-resize-job/
			{ name: 'Presentation', value: 'presentation' },
			{ name: 'Whiteboard', value: 'whiteboard' },
		],
		default: 'presentation',
		required: true,
		displayOptions: {
			show: { resource: ['resize'], operation: ['create'], designType: ['preset'] },
		},
		description: 'The preset design type to resize to',
	},
	{
		displayName: 'Width (Px)',
		name: 'width',
		type: 'number',
		typeOptions: { minValue: 40, maxValue: 8000 },
		default: 800,
		required: true,
		displayOptions: {
			show: { resource: ['resize'], operation: ['create'], designType: ['custom'] },
		},
		description: 'Width of the resized design in pixels',
	},
	{
		displayName: 'Height (Px)',
		name: 'height',
		type: 'number',
		typeOptions: { minValue: 40, maxValue: 8000 },
		default: 600,
		required: true,
		displayOptions: {
			show: { resource: ['resize'], operation: ['create'], designType: ['custom'] },
		},
		description: 'Height of the resized design in pixels',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 2000,
		displayOptions: { show: { resource: ['resize'], operation: ['create'] } },
		description: 'How often to check if the resize job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 300 },
		default: 60,
		displayOptions: { show: { resource: ['resize'], operation: ['create'] } },
		description: 'Maximum time to wait for the resize to complete before timing out',
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const generationGenerateImageDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description: 'Description of the image to generate (max 5000 characters)',
		placeholder: 'A watercolor poster of a lighthouse at dawn',
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: [
			{ name: 'Landscape (16:9)', value: 'landscape' },
			{ name: 'Landscape (3:2)', value: 'landscape_3_2' },
			{ name: 'Portrait (2:3)', value: 'portrait_2_3' },
			{ name: 'Portrait (4:5)', value: 'portrait_4_5' },
			{ name: 'Portrait (9:16)', value: 'portrait' },
			{ name: 'Square (1:1)', value: 'square' },
		],
		default: 'square',
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description: 'The shape of the generated image',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{
				name: 'Auto',
				value: 'auto',
				description: 'Canva picks the best model, and falls back to another if one is unavailable',
			},
			{
				name: 'Canva Craft',
				value: 'craft_v1_2k',
				description:
					"Canva's own model. Suited to infographics, posters, slides, portraits, landscapes, products, and marketing materials. Takes about a minute.",
			},
			{
				name: 'Lucid Origin',
				value: 'lucid_origin',
				description: 'Suited to architecture, logos, posters, and sci-fi or fantasy scenes',
			},
			{
				name: 'Z-Image Turbo',
				value: 'z_image_turbo',
				description: 'Suited to images with text, food and drink, and general-purpose imagery',
			},
		],
		default: 'auto',
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description:
			'The AI model to generate the image with. If you pick a specific model and it is unavailable, the job fails instead of falling back.',
	},
	{
		displayName: 'Save to Uploads',
		name: 'saveToUploads',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description:
			"Whether to also save the image to the user's Canva Uploads, so its asset ID can be used in other Canva operations",
	},
	{
		displayName: 'Asset Name',
		name: 'assetName',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['generation'], operation: ['generateImage'], saveToUploads: [true] },
		},
		description:
			'Name for the saved asset (max 255 characters). If left empty, Canva generates one.',
		placeholder: 'Lighthouse Poster',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 2000,
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description: 'How often to check if the image generation job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 600 },
		default: 120,
		displayOptions: { show: { resource: ['generation'], operation: ['generateImage'] } },
		description: 'Maximum time to wait for the image generation to complete before timing out',
	},
];

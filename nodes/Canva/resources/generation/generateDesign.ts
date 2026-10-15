import type { INodeProperties } from 'n8n-workflow';

export const generationGenerateDesignDescription: INodeProperties[] = [
	{
		displayName: 'Brief',
		name: 'brief',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: { show: { resource: ['generation'], operation: ['generateDesign'] } },
		description:
			'Description of the design to generate: its subject, purpose, required wording, tone, and visual direction (max 5000 characters)',
		placeholder:
			'A 3-slide pitch deck for a solar-panel startup, with an energetic, modern, blue-and-white look',
	},
	{
		// Not named `designType`: that name is already an options parameter with different values
		// on the Design and Resize resources, and n8n can carry a stale value across resources.
		displayName: 'Design Type',
		name: 'designTypeName',
		type: 'options',
		options: [
			{ name: 'Doc', value: 'doc', description: 'A Canva doc' },
			{ name: 'Presentation', value: 'presentation', description: 'A slide presentation' },
		],
		default: 'presentation',
		required: true,
		displayOptions: { show: { resource: ['generation'], operation: ['generateDesign'] } },
		description: 'The type of design to generate',
	},
	{
		displayName: 'Outline',
		name: 'outline',
		type: 'json',
		typeOptions: { rows: 6 },
		// Shows users Canva's outline shape, and is valid JSON so n8n's editor doesn't flag the
		// untouched field. An empty outline isn't sent.
		default: '{"sections": []}',
		displayOptions: {
			show: {
				resource: ['generation'],
				operation: ['generateDesign'],
				designTypeName: ['presentation'],
			},
		},
		description:
			'Optional slide-by-slide structure to follow, in Canva\'s outline format: up to 100 <code>sections</code>, each with a <code>title</code> and an optional <code>description</code> and <code>points</code> (up to 50). Example: <code>{"sections":[{"title":"The problem","points":["Energy bills are up 30%"]},{"title":"Our solution"}]}</code>. Leave <code>sections</code> empty to let Canva plan the slides.',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 3000,
		displayOptions: { show: { resource: ['generation'], operation: ['generateDesign'] } },
		description: 'How often to check if the design generation job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 600 },
		default: 300,
		displayOptions: { show: { resource: ['generation'], operation: ['generateDesign'] } },
		description: 'Maximum time to wait for the design generation to complete before timing out',
	},
];

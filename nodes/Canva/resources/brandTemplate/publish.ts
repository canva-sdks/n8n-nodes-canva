import type { INodeProperties } from 'n8n-workflow';

export const brandTemplatePublishDescription: INodeProperties[] = [
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['brandTemplate'], operation: ['publish'] } },
		description:
			'The ID of the design to publish as a brand template. If this design is a draft of an existing brand template, that template will be updated.',
		placeholder: 'DAFVztcvd9z',
	},
];

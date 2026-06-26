import type { INodeProperties } from 'n8n-workflow';

export const mergeCreateDescription: INodeProperties[] = [
	{
		displayName: 'Merge Type',
		name: 'mergeType',
		type: 'options',
		options: [
			{
				name: 'Create New Design',
				value: 'create_new_design',
				description: 'Create a new design by inserting pages from other designs',
			},
			{
				name: 'Modify Existing Design',
				value: 'modify_existing_design',
				description: 'Modify an existing design by inserting, moving, or deleting pages',
			},
		],
		default: 'create_new_design',
		required: true,
		displayOptions: { show: { resource: ['merge'], operation: ['create'] } },
		description: 'The type of merge job to create',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['merge'], operation: ['create'], mergeType: ['create_new_design'] },
		},
		description: 'Title for the new merged design (max 255 characters)',
		placeholder: 'My Merged Design',
	},
	{
		displayName: 'Design ID',
		name: 'designId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['merge'], operation: ['create'], mergeType: ['modify_existing_design'] },
		},
		description: 'The ID of the existing design to modify',
		placeholder: 'DAFVztcvd9z',
	},
	{
		displayName: 'Operations',
		name: 'operations',
		type: 'json',
		default: '[]',
		required: true,
		displayOptions: { show: { resource: ['merge'], operation: ['create'] } },
		description:
			'Array of page operations to apply. Supported types: <code>insert_pages</code>, <code>move_pages</code>, <code>delete_pages</code>. Example insert: <code>[{"type":"insert_pages","source":{"type":"design","design_id":"DAFVztcvd9z"}}]</code>',
		typeOptions: { rows: 6 },
	},
	{
		displayName: 'Optional Title',
		name: 'optionalTitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['merge'], operation: ['create'], mergeType: ['modify_existing_design'] },
		},
		description: 'Optional new title for the modified design (max 255 characters)',
		placeholder: 'Updated Design Title',
	},
	{
		displayName: 'Poll Interval (Ms)',
		name: 'pollInterval',
		type: 'number',
		typeOptions: { minValue: 500, maxValue: 30000 },
		default: 3000,
		displayOptions: { show: { resource: ['merge'], operation: ['create'] } },
		description: 'How often to check if the merge job is complete (milliseconds)',
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWait',
		type: 'number',
		typeOptions: { minValue: 10, maxValue: 300 },
		default: 60,
		displayOptions: { show: { resource: ['merge'], operation: ['create'] } },
		description: 'Maximum time to wait for the merge to complete before timing out',
	},
];

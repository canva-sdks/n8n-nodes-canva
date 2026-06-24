import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{
				name: 'Get Me',
				value: 'getMe',
				description: 'Get the User ID and Team ID of the authenticated user',
				action: 'Get current user',
			},
			{
				name: 'Get Profile',
				value: 'getProfile',
				description: 'Get the display name of the authenticated user',
				action: 'Get user profile',
			},
		],
		default: 'getMe',
	},
];

export const userDescription: INodeProperties[] = [...userOperations];

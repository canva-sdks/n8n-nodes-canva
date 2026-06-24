import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class CanvaOAuth2Api implements ICredentialType {
	name = 'canvaOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Canva OAuth2 API';

	documentationUrl = 'https://github.com/canva-dev/n8n-nodes-canva?tab=readme-ov-file#credentials';

	icon: Icon = `file:canva.svg`;

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://www.canva.com/api/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.canva.com/rest/v1/oauth/token',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default:
				'asset:read asset:write brandtemplate:content:read brandtemplate:meta:read design:content:read design:content:write design:meta:read folder:read folder:write profile:read',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}

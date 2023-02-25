export type TApiKeyPermission =
	| "event:create"
	| "event:query"
	| "event:update"
	| "event:delete"
	| "project:create"
	| "project:query"
	| "project:update"
	| "project:delete";

export interface IApiKey {
	createdAt: number;
	apiKey: string; // The actual API key
	name: string; // Displayname
	project: string; // ProjectId for which the API is valid
}

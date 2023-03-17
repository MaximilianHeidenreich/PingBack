import type { IError, IResponse } from "$lib/api/IResponse";

import { isApiKeyValid } from "./apiKey";


export async function validApiKey(request: Request, project: string): Promise<boolean> {
    const API_KEY = request.headers.get("X-API-Key");
    if (!API_KEY) return false;
    if (!(await isApiKeyValid(API_KEY, project))) return false;
    return true;
}

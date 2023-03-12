import type { IApiKey } from "$lib/types/IApiKey";
import type { IApiResponseErr, IApiResponseOk } from "./apiClient";

export interface IQueryOkData {
    items: IApiKey[];
    count: number;
    last?: string;
}
export function query<T, E>(fetch?: typeof global.fetch) {
    return async function (): Promise<IApiResponseOk<IQueryOkData> | IApiResponseErr<number>> {
        const res: IApiResponseOk<IQueryOkData> = {
            status: 200,
            statusText: "OK",
            data: {
                items: [],
                count: 0
            }
        }
        return res;
    }
}
export function all() {
    
}
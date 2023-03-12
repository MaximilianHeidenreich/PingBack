import { query as queryKeys, all as allKeys, type IQueryOkData } from "./clientKeys";

export interface IApiResponse {
    status: number;
    statusText: string;
}
export interface IApiResponseOk<T> extends IApiResponse {
    status: 200;
    data: T;
}
export interface IApiResponseErr<T> extends IApiResponse {
    error: T;
}

//export type TClientConstructor<T, E> = (fetch?: typeof global.fetch) => () => any;//() => Promise<IApiResponseOk<T> | IApiResponseErr<E>>;
export type TClientConstructor = <T, E>() => Promise<IApiResponseOk<T> | IApiResponseErr<E>>;

export interface IApiClient {
    projects: {},
    events: {},
    keys: {
        query: TClientConstructor,//<IQueryOkData, number>,
        all: any,
    }
}

export function createApiClient(fetch?: typeof global.fetch): IApiClient {

    return {
        projects: {

        },
        events: {

        },
        keys: {
            query: queryKeys(fetch),
            all: allKeys
        }
    }

}

createApiClient().keys.query();
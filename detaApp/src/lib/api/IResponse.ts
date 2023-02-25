export interface IResponse {
    ok: true;
    data?: unknown;
}

export interface IError {
    ok: false;
    error: string | number | unknown;
}

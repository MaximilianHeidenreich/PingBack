export type Result<T, E> = Ok<T> | Error<E>;
export type PResult<T, E> = Promise<Ok<T> | Error<E>>;

export type Ok<T> = {
    ok: true;
} & T;

export type Error<T> = {
    ok: false;
} & T;
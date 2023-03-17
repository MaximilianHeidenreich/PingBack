export type TFetcher = (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
) => Promise<Response>;

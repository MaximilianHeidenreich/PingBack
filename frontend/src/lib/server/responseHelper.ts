/**
 * Builder implementation for easier response creation.
 * @returns
 */
export function buildResponse() {
    class ResponseBuilder {
        private m_body: string | object | null;
        private m_headers: Map<string, string>;
        private m_status: number;
        private m_statusText: string | undefined;
        constructor() {
            this.m_body = null;
            this.m_headers = new Map();
            this.m_status = 200;
            this.m_statusText = undefined;
        }

        build(): Response {
            const response = new Response(JSON.stringify(this.m_body), {
                status: this.m_status,
                statusText: this.m_statusText,
                headers: Object.fromEntries(this.m_headers)
            });
            return response;
        }

        body(bodyData: string | object | null) {
            this.m_body = bodyData;
            return this;
        }
        json(data: object): ResponseBuilder {
            this.m_body = data;
            this.m_headers.set("content-type", "application/json");
            return this;
        }
        text(data: string): ResponseBuilder {
            this.m_body = data;
            this.m_headers.set("content-type", "text/plain");
            return this;
        }
        header(name: string, value: string): ResponseBuilder {
            this.m_headers.set(name, value);
            return this;
        }
        status(statusCode: number): ResponseBuilder {
            this.m_status = statusCode;
            return this;
        }
        statusText(statusText: string): ResponseBuilder {
            this.m_statusText = statusText;
            return this;
        }
    }
    return new ResponseBuilder();
}

export function respondBadRequest(body: string | object | null): Response {
    return buildResponse().status(400).statusText("Bad Request").body(body).build();
}

export function respondUnauthenticated(body: string | object | null): Response {
    return buildResponse().status(401).statusText("Unauthorized").body(body).build();
}

export function respondNotFound(body: string | object | null): Response {
    return buildResponse().status(404).statusText("Not Found").body(body).build();
}

export function respondInternalError(body: string | object | null): Response {
    return buildResponse().status(500).statusText("Internal Server Error").body(body).build();
}

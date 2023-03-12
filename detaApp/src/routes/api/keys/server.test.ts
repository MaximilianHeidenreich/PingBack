import { describe, expect, test } from "vitest";
import { POST } from "./+server";

describe("/api/keys POST", () => {

    const cookies = { get: () => undefined, set: () => {}, delete: () => {}, serialize: () => ""};

    test("valid request", () => {
        const url = new URL("https://example.com/api/keys");
        const request = new Request("https://example.com/api/keys");        


        //POST({ url, request, cookies, fetch, getClientAddress })

        expect("").toBe("Foo-Bar_baz69");
    })
});

describe("/api/keys GET", () => {

    const cookies = { get: () => undefined, set: () => {}, delete: () => {}, serialize: () => ""};

    test("valid request", () => {
        const url = new URL("https://example.com/api/keys");
        const request = new Request("https://example.com/api/keys");        


        //POST({ url, request, cookies, fetch, getClientAddress })

        expect("").toBe("Foo-Bar_baz69");
    })
});
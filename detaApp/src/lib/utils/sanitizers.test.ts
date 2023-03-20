import { describe, expect, test } from "vitest";
import { sanitizeProjectIdInput, sanitizeProjectIdInternal } from "./sanitizers";

describe("sanitizeProjectIdInput", () => {
    test("keep valid input", () => {
        const input = "Foo-Bar_baz69";
        expect(sanitizeProjectIdInput(input)).toBe("Foo-Bar_baz69");
    });
    test("replace spaces", () => {
        const input = "Foo bar";
        expect(sanitizeProjectIdInput(input)).toBe("Foo-bar");
    });
    test("trim leading and trailing whitespace", () => {
        const input = "  Foo-bar\nbaz  ";
        expect(sanitizeProjectIdInput(input)).toBe("Foo-bar_baz");
    });
    test("replace unallowed characters", () => {
        const input = "F00_bar#baz";
        expect(sanitizeProjectIdInput(input)).toBe("F00_bar_baz");
    });
});

describe("sanitizeProjectIdInternal", () => {
    test("keep valid input", () => {
        const input = "foo-bar_baz69";
        expect(sanitizeProjectIdInternal(input)).toBe("foo-bar_baz69");
    });
    test("lowercase kapitals", () => {
        const input = "Foo-Bar_baz69";
        expect(sanitizeProjectIdInternal(input)).toBe("foo-bar_baz69");
    });
    test("replace spaces", () => {
        const input = "Foo bar";
        expect(sanitizeProjectIdInternal(input)).toBe("foo-bar");
    });
    test("trim leading and trailing whitespace", () => {
        const input = "  Foo-bar\nbaz  ";
        expect(sanitizeProjectIdInternal(input)).toBe("foo-bar_baz");
    });
    test("replace unallowed characters", () => {
        const input = "F00_bar#baz";
        expect(sanitizeProjectIdInternal(input)).toBe("f00_bar_baz");
    });
});

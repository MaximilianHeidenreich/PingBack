import { describe, expect, test } from "vitest";
import { FakeBase } from "./fakeBase";
import type { IDBRecord } from "$lib/types/IDBRecord";

describe("fakeBase", () => {
    interface TestSchema {
        name: string;
        age: number;
    }

    // PUT
    test("put new item", async () => {
        const db = new FakeBase<TestSchema>();

        await db.put({ name: "max", age: 21 }, "max");

        expect(Object.fromEntries(db.getStore())).toStrictEqual({
            "max": { name: "max", age: 21 }
        });
    });
    test("put existing key replaces item", async () => {
        const db = new FakeBase<TestSchema>();

        await db.put({ name: "max", age: 21 }, "max");
        await db.put({ name: "maxi", age: 50 }, "max");

        expect(Object.fromEntries(db.getStore())).toStrictEqual({
            "max": { name: "maxi", age: 50 }
        });
    });
    test("put auto generate key", async () => {
        const db = new FakeBase<TestSchema>();

        await db.put({ name: "max", age: 21 });

        expect(db.getStore().keys().next().value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    // INSERT
    test("insert new key", async () => {
        const db = new FakeBase<TestSchema>({
            "max": { name: "maxi", age: 23 },
        });

        await db.insert({ name: "bar", age: 24 }, "foo");

        expect(Object.fromEntries(db.getStore())).toStrictEqual({
            "max": { name: "maxi", age: 23 },
            "foo": { name: "bar", age: 24 }
        });
    });
    test("insert throw on existing key", async () => {
        const db = new FakeBase<TestSchema>({
            "max": { name: "maxi", age: 23 },
        });

        expect(async () => await db.insert({ name: "bar", age: 24 }, "max"))
            .rejects.toThrow();
    });
    test("insert auto generate key", async () => {
        const db = new FakeBase<TestSchema>();

        await db.insert({ name: "max", age: 21 });

        expect(db.getStore().keys().next().value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    // PUT MANY
    test.todo("put many < 25");
    test.todo("put many throw on > 25");

    // GET
    test("get existing key", async () => {
        const db = new FakeBase<TestSchema>({
            "max": { name: "maxi", age: 23 },
            "foo": { name: "bar", age: 24 }
        });

        const res = await db.get("max");

        expect(res).toStrictEqual({
            name: "maxi", age: 23
        });
    });
    test("get unknown key", async () => {
        const db = new FakeBase<TestSchema>({
            "max": { name: "maxi", age: 23 },
            "foo": { name: "bar", age: 24 }
        });

        const res = await db.get("unknownKey");

        expect(res).toStrictEqual(null);
    });

    // DELETE
    test("delete key", async () => {
        const db = new FakeBase<TestSchema>({
            "max": { name: "maxi", age: 23 },
            "foo": { name: "bar", age: 24 }
        });

        await db.delete("max");

        expect(Object.fromEntries(db.getStore())).toStrictEqual({
            "foo": { name: "bar", age: 24 }
        });
    });

    // UPDATE

    // FETCH

});
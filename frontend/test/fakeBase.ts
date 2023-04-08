import crypto from "crypto";
import { PartialBy } from "../src/lib/types/utilTypes";
import { IDBRecord } from "../src/lib/types/IDBRecord";

/**
 * A fake Deta Base implementation mirroring the SDK useful for testing.
 */
export class FakeBase<Schema> {
    store: Map<string, Schema>;

    constructor(initial?: Record<string, Schema>) {
        this.store = new Map(Object.entries(initial || {}));
    }

    getStore() {
        return this.store;
    }

    get(key: string): Promise<Schema | null> {
        return Promise.resolve(this.store.get(key) || null);
    }
    put(data: Schema, key: string | null = null): Promise<Schema> {
        if (!key) key = crypto.randomUUID();
        this.store.set(key, data);
        return Promise.resolve(data);
    }
    putMany(items: Schema[]): Promise<{ processed: {items: Schema[]} }> {
        // throw > 25
        throw "FakeBase putMany not implemented!"
        return Promise.resolve({ processed: { items: [] } });
    }
    insert(data: Schema, key: string | null = null): Promise<Schema> {
        // throw key exist
        if (key && this.store.has(key)) throw "FakeBase insert key already exists!";
        if (!key) key = crypto.randomUUID();
        this.store.set(key, data);
        return Promise.resolve(data);
    }
    delete(key: string): Promise<null> {
        this.store.delete(key);
        return Promise.resolve(null);
    }
    update(updates: Partial<Schema>, key: string): Promise<null> {
        if (!this.store.has(key)) throw "FakeBase update key does not exist!";
        // TODO: Support "actions" & dot chaining
        const o = this.store.get(key)!;
        for (const key of Object.keys(updates)) {
            if (key.includes(".")) {
                throw "TODO DEEP UPDATES"
            }
            o[key] = updates[key];
        }
        return Promise.resolve(null);
    }
    fetch(query: Partial<Schema>, options: { limit?: number, last?: string }): Promise<{ count: number; last?: string, items: Schema[] }> {
        const queryFns: ((o: object) => boolean)[] = [];
        // Build query
        for (const key of Object.keys(query)) {
            const cleanKey = key.includes("?") ? key.substring(0, key.indexOf("?")) : key;

            if (key.includes("?ne")) queryFns.push(qNotEquals(cleanKey, query[key]));
            else if (key.includes("?lt")) queryFns.push(qLessThan(cleanKey, query[key]));
            else if (key.includes("?gt")) queryFns.push(qGreaterThan(cleanKey, query[key]));
            else if (key.includes("?lte")) queryFns.push(qLessThanEqual(cleanKey, query[key]));
            else if (key.includes("?gte")) queryFns.push(qGreaterThanEqual(cleanKey, query[key]));
            else if (key.includes("?pfx")) queryFns.push(qGreaterThanEqual(cleanKey, query[key]));
            else if (key.includes("?r")) queryFns.push(qRange(cleanKey, query[key]));
            else if (key.includes("?contains")) queryFns.push(qContains(cleanKey, query[key]));
            else if (key.includes("?not_cntains")) queryFns.push(qNotContains(cleanKey, query[key]));

            // Default is equals
            queryFns.push(qEquals(cleanKey, query[key]));
        }

        // Filter
        const items: Schema[] = [];
        let i = 0;
        for (const doc of this.store.values()) {
            if (matchesQuery(doc as object, queryFns)) items.push(doc); // TODO: type
            i += 1;
            if (options.last && i >= (options.limit || Number.arguments)) break;
        }

        return Promise.resolve({
            items,
            count: items.length
        });
    }

}

const qEquals = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] === val;
const qNotEquals = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] !== val;
const qLessThan = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] < val;
const qGreaterThan = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] > val;
const qLessThanEqual = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] <= val;
const qGreaterThanEqual = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key] >= val;
const qPrefix = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key].startsWith(val);
const qRange = (key: string, val: string | number | boolean | any[]) => (o: object) => val[0] <= o[key] <= val[1];
const qContains = (key: string, val: string | number | boolean | any[]) => (o: object) => o[key].includes(val);
const qNotContains = (key: string, val: string | number | boolean | any[]) => (o: object) => !o[key].includes(val);

function matchesQuery(o: object, queryFns: ((o: object) => boolean)[]): boolean {
    for (const f of queryFns) {
        if (!f(o)) return false;
    }
    return true;
}
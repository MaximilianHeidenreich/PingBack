import { env } from "$env/dynamic/private";
import { Deta } from "deta";

export const deta = Deta(env.DETA_PROJECT_KEY);

/**
 * Creates a custom wrapper around deta.Base for better typing & version migration assistance.
 * @param dbName 
 * @returns 
 */
const wrap_db = <T>(dbName: string) => {
    type TReturn = T & { key: string };
    type TQuery = { [key: string]: unknown };
    const db = deta.Base(dbName);

    return {
        /**
         * Puts item in db, overrides if key already exists.
         * @param data 
         * @param key Primary key or null to generate one.
         * @returns The inserted item.
         * @throws Deta error.
         */
        put: (data: T, key: string | null): Promise<TReturn> => { 
            // @ts-expect-error expect deta sdk to shit itself but we are fine :)
            return db.put(data, key) as Promise<TReturn>;
        },

        /**
         * Get item from db or null if not found.
         * @param key 
         * @returns Item or null.
         * @throws Deta error.
         */
        get: (key: string): Promise<TReturn> => { return db.get(key) as Promise<TReturn> },

        /**
         * Deletes item from db even if it does not exist.
         * @param key 
         * @returns 
         */
        delete: (key: string): Promise<null> => {
            return db.delete(key);
        },

        /**
         * Inserts item in db.
         * ! Throws if key already exists.
         * @param data 
         * @param key Primary key or null to generate one.
         * @returns The inserted item.
         * @throws Key already exists | Deta error.
         */
        insert: (data: T, key: string | null): Promise<TReturn> => {
            // @ts-expect-error expect deta sdk to shit itself but we are fine :)
            return db.insert(data, key) as Promise<TReturn>;
        },

        putMany: () => { console.error("UNSUPPORTED putMany"); throw "UNSUPPORTED putMany" },

        /**
         * Update existing item identified by key with updates.
         * ! Auto deletes key from updates object.
         * @param updates 
         * @param key 
         * @returns 
         * @throws Deta error.
         */
        update: (updates: Partial<T>, key: string): Promise<null> => {
            // @ts-ignore try to always delete key from updates -> "Cannot change key" error otherwise.
            delete updates.key;
            // @ts-expect-error expect deta sdk to shit itself but we are fine :)
            return db.update(updates, key);
        },

        /**
         * Fetch all items matching query
         * @param query 
         * @param options 
         * @returns 
         */
        fetch: (query: (T & TQuery) | (T & TQuery)[], options: { limit?: number, last?: string}): Promise<{ items: TReturn[], count: number, last?: string }> => {
            // @ts-expect-error expect deta sdk to shit itself but we are fine :)
            return db.fetch(query, options) as Promise<{ items: TReturn[], count: number, last?: string }>;
        },
    }
}

export const db_apiKeys = wrap_db("apiKeys");//deta.Base("apiKeys");
export const db_events = wrap_db("events");//deta.Base("events");
export const db_projects = wrap_db("projects");//deta.Base("projects");
export const db_system = wrap_db("system");//deta.Base("system");       // System data -> configuration, migrations, etc.

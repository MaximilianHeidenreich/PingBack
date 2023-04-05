import { db_projects, db_system, DB_SYS_KEY } from "$lib/server/deta";
import { server_createEvent, type ICreateEvent } from "$lib/server/event";
import type { IEvent } from "$lib/types/IEvent";
import type { IProject } from "$lib/types/IProject";
import { DEFAULT_SYSTEM_DOC } from "$lib/types/ISystemDoc";
import { VERSION } from "$lib/utils/version";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { PageServerLoad } from "./$types";

export const load = (async ({  }) => {
    const sysdoc = await db_system.get(DB_SYS_KEY);
    if (!sysdoc) {
        console.info("SYSDOC not found! Creating default one & Start initial setup!");
        await db_system.put(DEFAULT_SYSTEM_DOC(), DB_SYS_KEY);

        // Add initial event.
        const initialEvent: ICreateEvent = {
            project: "default",
            channel: "default",
            name: "pingback.internal",
            icon: "👋",
            parser: "text",

            // PAYLOAD
            title: "Welcome to PingBack",
            description: "Todo insert a cool description here.",
            tags: {}
        }
        // Add default project & default channel
        const initialProject: IProject = {
            key: "default",
            createdAt: dayjs().valueOf(),
            contentHash: "rand",
            displayName: "Default Project",
            channels: [{ id: "default", notify: true, latestEventTimestamp: Date.now() }],
            eventSpecifiers: {},
            latestEventTimestamp: Date.now()
        }
        await db_projects.put(initialProject, "default");
        await server_createEvent(initialEvent);

        throw redirect(303, "/welcome");
    }

    // Handle version updates.
    if (sysdoc.latestAppVersion !== VERSION.semver!.version) {
        console.info(`Version update detected (${sysdoc.latestAppVersion} -> ${VERSION.semver!.version})! Updating sysdoc & performing updates.`);

        // TODO: Run updates
        sysdoc.latestAppVersion = VERSION.semver!.version;
        await db_system.update(sysdoc, DB_SYS_KEY);

        // TODO: Redirect to update changelog page -> add refirect after continue query param
    }

    // Redirect wo welcome page if not finished / skipped tour.
    if (!sysdoc.finishedWelcomeTour) {
        throw redirect(303, "/welcome");
    }

    const pickRand = (array: any[]) => array[Math.floor(Math.random() * array.length)];
    const dev_events: IEvent[] = [];
    const dev_projects = ["default"]//, "project2", "foobar"];
    const dev_channels = ["general", "test", "logs"];
    const dev_eventNames = ["test", "foo", "payment.success", "payment.failed"];
    const dev_icons = ["🔥", "🔔", "👤", "🔮", "⚡️"];

    const createEvent = (hour: number, minute: number, project: string, channel: string, event: string) => {
        return {
            key: crypto.randomUUID(),
            v: 1,
            createdAt: dayjs().subtract(hour, "hour").subtract(minute, "minute").valueOf(),
            project: project,
            channel: channel,
            eventName: event,
            notify: true,
            icon: pickRand(dev_icons),
            parser: "text",
            title: `Event -${hour}h:${minute}m`,
            description: "Test description",
            tags: {
                foo: "bar",
                bat: "baz"
            }
        }
    }
    const pushXEvents = (arr: any[], nH: number, nM: number) => {
        dev_projects.forEach(project => {
            for (let h = 0; h < nH; h++) {
                let c = pickRand(dev_channels);
                for (let m = 0; m < nM; m++) {
                    arr.push(createEvent(h, m, project, c, pickRand(dev_eventNames)));
                }
            }
        });
    }
    pushXEvents(dev_events, 5, 30);
    let i = 0;
    const ps: { [key: string]: IProject | null } = {
        "test": await db_projects.get("test"),
        "project2": await db_projects.get("project2"),
        "foobar": await db_projects.get("foobar")
    }
    /*for (let e of dev_events) {
        console.log(`inserting ${i} / ${dev_events.length}`);
        const p = structuredClone(ps[e.project]);

        i = i + 1;
    }
    */

    return {};
}) satisfies PageServerLoad;

import { serverCreateEvent } from "$lib/helpers/event";
import { db_events, db_projects, db_system, DB_SYS_KEY, db_timeFrames } from "$lib/server/deta";
import { updateCurrentSysContentHash } from "$lib/stores/s_sysContentHash";
import type { IEvent } from "$lib/types/IEvent";
import type { IProject } from "$lib/types/IProject";
import { DEFAULT_SYSTEM_DOC } from "$lib/types/ISystemDoc";
import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({  }) => {
    const sysdoc = await db_system.get(DB_SYS_KEY);
    if (!sysdoc) {
        console.log("SYSDOC not found! Creating default one & Start initial setup!");
        await db_system.put(DEFAULT_SYSTEM_DOC(), DB_SYS_KEY);

        // TODO: Add first event & timeframe manually.
        const frameEnd = dayjs().endOf(TIME_FRAME_OFFSET_UNIT);
        const initialEvent: IEvent = {
            key: crypto.randomUUID(),
            v: VERSION.major,
            createdAt: dayjs().valueOf(),
            project: "default",
            channel: "default",
            eventName: "pingback.internal",
            icon: "👋",
            parser: "text",

            // PAYLOAD
            title: "Welcome to PingBack",
            description: "Todo insert a cool description here.",
            tags: {}
        }
        await db_timeFrames.put({
            frameEnd: frameEnd.valueOf(),
            nextFrame: -1,
            previousFrame: -1,
            containsEventsFor: { projects: [initialEvent.project], channels: [`${initialEvent.project}#${initialEvent.channel}`] }
        }, frameEnd.valueOf().toString());
        await db_events.put(initialEvent, initialEvent.key);
        // TODO: Add default project & default channel
        await db_projects.put({
            key: "default",
            createdAt: dayjs().valueOf(),
            contentHash: "rand",
            displayName: "Default Project",
            channels: [{ id: "default", notify: true, latestEventTimestamp: initialEvent.createdAt }],
            eventSpecifiers: {},
            latestEventTimestamp: initialEvent.createdAt
        }, "default");
        // TODO!: Update sysdoc totalEvents +1

        throw redirect(303, "/welcome");
    }

    // Handle version updates.
    if (sysdoc.latestAppVersion !== VERSION.semver!.version) {
        console.log(`Version update detected (${sysdoc.latestAppVersion} -> ${VERSION.semver!.version})! Updating sysdoc & performing updates.`);

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

        await serverCreateEvent(e, p as IProject);
        i = i + 1;
    }
    */

    return {};
}) satisfies LayoutServerLoad;
<script lang="ts">
    //import { db_events } from "$lib/server/deta";
    import type { IEvent } from "$lib/types/IEvent";
    import dayjs from "dayjs";
    import "$css/app.postcss";
    import { Toaster } from "svelte-french-toast";

    // TODO: REMOVE; DEV ONLY!
    const dev_events: IEvent[] = [
        {
            key: crypto.randomUUID(),
            v: 1,
            createdAt: dayjs().valueOf(),
            project: "test-project",
            channel: "general",
            eventName: "test.first",
            notify: true,
            icon: "🔔",
            parser: "text",
            title: `General 1 - ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`,
            description: "Test description",
            tags: {
                foo: "bar",
                bat: "baz"
            }
        },
        {
            key: crypto.randomUUID(),
            v: 1,
            createdAt: dayjs().subtract(1, "minute").valueOf(),
            project: "test-project",
            channel: "general",
            eventName: "test.first",
            notify: true,
            icon: "🔔",
            parser: "text",
            title: `General 2 - ${dayjs().subtract(1, "minute").format("DD-MM-YYYY HH:mm:ss")}`,
            description: "Test description",
            tags: {
                foo: "bar",
                bat: "baz"
            }
        }
    ];
    const f = (arr: any[], hour: number, items: number = 5, channel: string = "general") => {
        for (let i = 1; i <= items; i++) {
            arr.push({
                key: crypto.randomUUID(),
                v: 1,
                createdAt: dayjs().subtract(hour, "hour").subtract(3, "minute").valueOf(),
                project: "test-project",
                channel: "general",
                eventName: "test.first",
                notify: true,
                icon: "🔔",
                parser: "text",
                title: `General -${hour}h 3 - ${dayjs()
                    .subtract(hour, "hour")
                    .subtract(i, "minute")
                    .format("DD-MM-YYYY HH:mm:ss")}`,
                description: "Test description",
                tags: {
                    foo: "bar",
                    bat: "baz"
                }
            });
        }
    };
    for (let x = 1; x < 30; x++) {
        f(dev_events, x, 80);
    }
    for (let x = 1; x < 30; x++) {
        f(dev_events, x, 80, "test");
    }
    //db_events.putMany(dev_events);
    dev_events.forEach((e) => {
        //db_events.put(e, e.key);
    });
</script>

<Toaster />
<slot />

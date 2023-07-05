import { buildResponse } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
    return buildResponse().status(200).statusText("OK").json({
        title: "Latest Events",
        description: "foo",
        /*items: eventsRes.items.map(e => { return {
            title: e.title,
            description: `${e.name} > ${(e.description as string).substring(
                0,
                (e.description as string).length > 20 ? 20 : (e.description as string).length
            )}`
        }; })*/
        items: [
            { title: "Event 1", description: "Foo bar description...", url: "" },
            { title: "Event 2", description: "Foo bar description...", url: "" },
            { title: "Event 3", description: "Foo bar description...", url: "" },
            { title: "Event 4", description: "Foo bar description...", url: "" },
        ]
    }).build();
}) satisfies RequestHandler;

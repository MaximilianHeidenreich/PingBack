import { sendPushNotification } from "$lib/server/pushNotifications";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
    const reqBody = await request.json();

    console.log("reqBody", reqBody);

    //res.status(201).json({});
    sendPushNotification(reqBody, { title: "Hello World", body: "This is a test" });

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
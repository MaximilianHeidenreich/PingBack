import { Invalid } from "$lib/errors/core";
import { savePushSubscription, sendPushNotificationToSubscription,  } from "$lib/server/pushNotifications";
import { buildResponse, respondInternalError } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
    const reqBody = await request.json();

    console.log("reqBody", reqBody);

    const { clientId, subscription } = reqBody;

    try {
        await savePushSubscription(clientId, subscription);
    } catch (e) {
        if (!(e instanceof Invalid)) return respondInternalError("Could not save push subscription!"); 
    }

    sendPushNotificationToSubscription(subscription, { title: "👋 Hello, PingBack here.", body: "You will now receive push notifications!" });

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;

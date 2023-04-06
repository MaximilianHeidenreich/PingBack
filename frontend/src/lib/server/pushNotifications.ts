import webpush from "web-push";

// TODO: gemerate on first start and save db
const VAPID_PUB_KEY = "BP4IatrOkh87p3CjGWmxcYSVAGYiKkt7M0An1p43Sdfak_t6k9jl4RyILdGW0_3tNZOu8BwYAxvxSAHqx84TVUc";
const VAPID_PRIV_KEY = "EWg1z4PbJOlKouqciamZsiYcx_FSzkjGZ5hz-9VIGCU";

webpush.setVapidDetails("mailto:test@test.com", VAPID_PUB_KEY, VAPID_PRIV_KEY);

export interface IPushNotificationPayload {
    title: string;
    body: string;
}

export async function sendPushNotification(subscription: webpush.PushSubscription, payload: IPushNotificationPayload) {
    const encodedPayload = JSON.stringify(payload);
    try {
        await webpush.sendNotification(subscription, encodedPayload);
    }
    catch (e) {
        console.error(e);
    }
}
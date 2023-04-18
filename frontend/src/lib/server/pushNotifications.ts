import { Invalid, NotFound } from "$lib/errors/core";
import webpush from "web-push";
import { db_pushSubscriptions, db_system, DB_SYS_KEY } from "./deta";

export interface IPushNotificationPayload { // TODO move to types dir
    title: string;
    body: string;
    //icon: string url
    //image: string url
    // badge: string url
    timestamp: number;
    // https://web.dev/push-notifications-display-a-notification/
}

 // TOOD: Look into web-push options

export async function savePushSubscription(clientId: string, subscription: webpush.PushSubscription) {
    try {
        await db_pushSubscriptions.insert({
            key: clientId,
            subscription
        }, clientId);
    } catch (e) {
        throw new Invalid("Client already subscribed!");
    }
}

export async function sendPushNotificationToClient(clientId: string) {}
export async function sendPushNotificationToSubscription(subscription: webpush.PushSubscription, payload: IPushNotificationPayload) {
    const [sysdoc] = await Promise.all([
        db_system.get(DB_SYS_KEY),
    ]);
    if (!sysdoc) throw new NotFound("Sysdoc not found!");

    webpush.setVapidDetails(
        "mailto:test@test.com",
        sysdoc.publicVapidKey,
        sysdoc.privateVapidKey
    );
    const encodedPayload = JSON.stringify(payload);
    try {
        await webpush.sendNotification(subscription, encodedPayload);
    }
    catch (e) {
        console.error(e);
        throw new Error("Fucked up,"); // TODO: Better err
    }
}

export async function sendPushNotificationToAllClients(payload: IPushNotificationPayload) {
    const [sysdoc, pushSubscriptions] = await Promise.all([
        db_system.get(DB_SYS_KEY),
        db_pushSubscriptions.fetch({}, {})
    ]);
    if (!sysdoc) throw new NotFound("Sysdoc not found!");

    webpush.setVapidDetails(
        "mailto:test@test.com",
        sysdoc.publicVapidKey,
        sysdoc.privateVapidKey
    ); // TODO: Move to one time setup, not on every single push

    const encodedPayload = JSON.stringify(payload);
    try {
        for (const sub of pushSubscriptions.items) {
            await webpush.sendNotification(sub.subscription, encodedPayload);
        }
    }
    catch (e) {
        console.error(e);
        throw new Error("Fucked up,"); // TODO: Better err
    }
}

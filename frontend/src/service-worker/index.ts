/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import type { IServiceWorkerMessage } from "$lib/utils/serviceWorker";
//import { build, files, prerendered, version } from "$service-worker";
//import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
/*const precache_list = [
  '/', // Attention: might not be ideal for your use case - read more below.
  ...build,
  ...files,
  ...prerendered
].map(s => ({
  url: s,
  revision: version
}))
precacheAndRoute(precache_list);*/

// MESSAGING API
let messagingPort: MessagePort;
function _sendMessage(message: IServiceWorkerMessage<unknown>) {
    if (messagingPort) messagingPort.postMessage(message);
}
function _handleMessage(event: MessageEvent<any>, message: IServiceWorkerMessage<unknown>) {
    if (message.type === "_INIT") {
        _onInit(event, message);
    }
}
function _onInit(event: MessageEvent<any>, message: IServiceWorkerMessage<unknown>) {
    messagingPort = event.ports[0];
    _sendMessage({ type: "_INIT_SUCCESS", payload: null });
}


// EVENT LISTENERS
self.addEventListener("activate", (event) => {
    self.addEventListener("message", function(event){
        //Message received from client
        console.log(event.data);
        _handleMessage(event, event.data);
    });
});

self.addEventListener("push", function(e) {
    const event = e as PushEvent;
    const data = event.data?.json(); // TODO: empty data handling
    console.info("Received push notification:", data);

    _sendMessage({ type: "receivePushNotification", payload: data });
});
import { PingBack } from "../mod.ts";

const pingback = new PingBack({
    apiKey: "5770eebb-3d77-4adc-bd07-77ab38f35b51",
    appUrl: "https://pingback-1-d7329150.deta.app",
    project: "deta",
});

/*await pingback.publishEvent({
    channel: "general",
    event: "test",
    title: "Hello World from Deno SDK",
    icon: "🦕",
});*/


/*try {
    throw new Error("Some error");
}
catch (err) {
    // @ts-ignore
}*/

await pingback.publishEvent({
    channel: "pingback",
    event: "push.sucess",
    title: "Pushed PingBack to DetaSpace",
    description: "",
    tags: {
        
    },
    parser: "text",
    icon: "🪐",
});

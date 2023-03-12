import { PingBack } from "../mod.ts";

const pingback = new PingBack({
    //apiKey: "5770eebb-3d77-4adc-bd07-77ab38f35b51",
    //appUrl: "https://pingback-1-d7329150.deta.app",
    apiKey: "d4bb6a94-76eb-46a1-b7d2-6d08937f89b4",
    appUrl: "http://localhost:5173",
    project: "test-project",
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
    channel: "general",
    event: "test.test",
    title: "Test event",
    description: "",
    tags: {
        "hello": "from client"
    },
    parser: "text",
    icon: "🪐",
});

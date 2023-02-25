import { PingBack } from "../mod.ts";

const pingback = new PingBack({
    apiKey: "d4bb6a94-76eb-46a1-b7d2-6d08937f89b4",
    appUrl: "http://localhost:5173",
    project: "test-project",
});

await pingback.publishEvent({
    channel: "general",
    event: "test",
    title: "Hello World from Deno SDK",
    icon: "🦕",
});
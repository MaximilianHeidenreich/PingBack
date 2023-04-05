<script lang="ts">
    import ShowcaseEventList from "$cmp/core/eventList/showcaseEventList/ShowcaseEventList.svelte";
    import type { IEvent } from "$lib/types/IEvent";
    import { onDestroy, onMount } from "svelte";
    import TourHeader from "./TourHeader.svelte";
    import TourStep from "./TourStep.svelte";
    import WelcomeList from "./WelcomeList.svelte";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import Layer from "iconsax-svelte/Layer.svelte";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";

    // STATE
    let currExampleEventIndex = 0;
    const exampleEvents: IEvent[] = [
        { key: "showcase", v: 1, createdAt: -1, parser: "text", tags: {},
            project: "shop",
            channel: "payments",
            name: "payment.success",
            title: "Sucessfull payment - $10.99",
            icon: "💰",
            description: "Card xxxx-xxxx-xxxx-xxxx was sucessfully charged.",
        },
        { key: "showcase", v: 1, createdAt: -1, parser: "text", tags: {},
            project: "shop",
            channel: "payments",
            name: "payment.fail",
            title: "Failed payment - $29.99",
            icon: "❗️",
            description: "Payment xxx-xxx failed due to invalid balance.",
        },
        { key: "showcase", v: 1, createdAt: -1, parser: "text", tags: {},
            project: "shop",
            channel: "shippments",
            name: "shippments.done",
            title: "Order #x69ako shipped.",
            icon: "🚚",
            description: "Shippment #x96ako-xxxx was shipped to customer.",
        },
    ];
    let events: IEvent[] = [];
    let timer: NodeJS.Timer | undefined;

    // FN
    function pushNextEvent() {
        exampleEvents[currExampleEventIndex].createdAt = Date.now();
        events = [exampleEvents[currExampleEventIndex], ...events];
        //events.push(exampleEvents[currExampleEventIndex]);
        //events = events;
        currExampleEventIndex += 1;
        if (currExampleEventIndex >= exampleEvents.length)
            currExampleEventIndex = 0;
    }

    // HANDLERS
    function onToggleListStyle() {
        if ($s_eventListStyle === "compact") s_eventListStyle.set("card");
        else s_eventListStyle.set("compact");
    }

    // HOOKS
    onMount(() => {
        timer = setInterval(pushNextEvent, 3000);
    });
    onDestroy(() => {
            timer && clearInterval(timer)
    });

    s_eventListStyle.set("card");
    pushNextEvent();

</script>

<TourStep>
    <svelte:fragment slot="header">
        <TourHeader>
            <svelte:fragment slot="title">
                The event <span class="text-pink-500">feed</span>.
            </svelte:fragment>
            <svelte:fragment slot="description">
                The feed is a list of all your events. It is automatically updated so you always see the latest events. 
                You can switch between a "compact" and "card" view with the button in the top right corner.<br>
                The feed can also be filtered to extract only relevant events.
            </svelte:fragment>
        </TourHeader>
    </svelte:fragment>

    <div class="list-wrapper">
        <IconButton on:click={onToggleListStyle} clazz="!absolute top-3 right-3"><Layer /></IconButton>
        {#if $s_eventListStyle === "compact"}
            <div class="max-w-2xl min-w-[65%] bg-white border-2 rounded-2xl h-fit overflow-hidden">
                <ShowcaseEventList {events} />
            </div>
        {:else}
            <ShowcaseEventList {events} />
        {/if}
    </div>

</TourStep>

<style lang="postcss">
    .list-wrapper {
        @apply relative flex-1 flex justify-center p-6;
        @apply border rounded-3xl min-h-[40ch] max-h-[40ch] overflow-y-auto bg-blue-50;
    }
</style>

<script lang="ts">
    import "$cmp/core/scaffold/scaffold.postcss";
    import { s_darkMode } from "$lib/stores/s_darkMode";
    import Tour from "./Tour.svelte";
    import Tour_Welcome from "./Tour_Welcome.svelte";
    import Tour_Feed from "./Tour_Feed.svelte";
    import Tour_BasicEvent from "./Tour_BasicEvent.svelte";
    import Tour_ProjectsAndChannels from "./Tour_ProjectsAndChannels.svelte";
    import Tour_Metrics from "./Tour_Metrics.svelte";
    import Tour_Monitoring from "./Tour_Monitoring.svelte";
    import Tour_End from "./Tour_End.svelte";
    import type { PageServerData } from "./$types";
    import type { IApiKey } from "@pingback/shared";
    import { setContext } from "svelte";

    // PROPS
    export let data: PageServerData;

    setContext<IApiKey | undefined>("default_apiKey", data.defaultApiKey);

    /*
    TODO: Flow:
    1. Welcome
    2. Event Feed
    3. Your first event.
    3. Adding data.
    4. Filtering events
    5. Monitoring events
    6. Have fun!
    */

    // STATE
    $: bgCol = $s_darkMode ? "#111" : "#fff";
    $: dotsCss = $s_darkMode ?
        `background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");` :
        `background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");`;

</script>

<div id="welcome-wrapper" style="background-color: {bgCol}; {dotsCss}">
    <div class="welcome-scaffold app-area">
        <Tour steps={[
            Tour_Welcome,
            Tour_Feed,
            Tour_BasicEvent,
            Tour_ProjectsAndChannels,
            Tour_Metrics,
            Tour_Monitoring,
            Tour_End
        ]} />
    </div>
</div>

<style lang="postcss">
    #welcome-wrapper {
        @apply relative h-full w-full px-8 isolate overflow-x-hidden;
    }
    @media screen and (max-width: 769px) {
        #welcome-wrapper {
            background-image: unset !important;
            @apply py-8;
        }
    }
    @media screen and (min-width: 768px) {
        #welcome-wrapper {
            @apply flex justify-center items-center;
        }
    }

    .welcome-scaffold {
        @apply flex justify-center items-stretch h-full px-8;
    }
    @media screen and (min-width: 768px) {
        .welcome-scaffold {
            @apply p-12;
            @apply max-w-4xl mx-auto w-full h-5/6;
        }
    }
</style>

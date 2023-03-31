<script lang="ts">
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fly } from "svelte/transition";
    import "./scaffold.postcss";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";
    // PROPS
    export let style: "section" | "transparent" = "section",
        clazz = "";
</script>

<main class:fullwidth={$s_appSidebarCollapsed}
    transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        x: 100
    }}>
    <div class="app-content {style === 'section' ? 'content-area' : 'content-area-transparent'} {clazz}">
        <slot/>
    </div>
</main>

<style lang="postcss">
    /* TODO: Do we need this override!? */
    .app-content {
        @apply flex-1 overflow-y-auto; /* flex flex-col */
    }

    main {
        grid-row: 1 / 3;
        grid-column: 1 / 3;
        @apply flex flex-col mt-28 h-auto -mx-6 /*overflow-hidden overflow-y-scroll*/;
    }

    @media screen and (min-width: 768px) {
        main {
            grid-row: 2;
            grid-column: 2;
            @apply m-0 h-auto;
        }
        main.fullwidth {
            grid-column: 1 / -1;
        }
    }
</style>
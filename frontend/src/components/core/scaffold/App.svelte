<script lang="ts">
    import { navigating } from "$app/stores";
    import { s_darkMode } from "$lib/stores/s_darkMode";
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fly } from "svelte/transition";
    import ModalPortal from "../modals/ModalPortal.svelte";
    import AppHeader from "./appHeader/AppHeader.svelte";
    import AppSidebar from "./AppSidebar.svelte";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";

    // STATE
    $: bgCol = $s_darkMode ? "#111" : "#fff";
    $: dotsCss = $s_darkMode ?
        `background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");` :
        `background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");`;
</script>

<ModalPortal />

<div id="app-wrapper" style="background-color: {bgCol}; {dotsCss}">
    <div class="app-scaffold">
        <AppSidebar />
        <AppHeader />
        <slot />
    </div>
</div>

<style lang="postcss">
    #app-wrapper {
        @apply relative h-full w-full isolate overflow-x-hidden;
        /*background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        */
    }
    @media screen and (max-width: 769px) {
        #app-wrapper {
            background-image: unset !important;
        }
    }
    @media screen and (min-width: 768px) {
        #app-wrapper {
            @apply flex justify-center items-center;
        }
    }

    .app-scaffold {
        @apply grid h-full px-6;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-columns: min-content 1fr;
        @apply from-neutral-50 to-neutral-100 bg-gradient-to-t;
    }
    @media screen and (min-width: 768px) {
        .app-scaffold {
            @apply gap-8 px-8;
            @apply max-w-4xl mx-auto w-full h-5/6;
            @apply bg-none;
        }
    }
</style>

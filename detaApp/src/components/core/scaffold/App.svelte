<script lang="ts">
    import { navigating } from "$app/stores";
    import { TKN_TRANSITION } from "$lib/utils/tokens";
    import { fly } from "svelte/transition";
    import ModalPortal from "../modals/ModalPortal.svelte";
    import AppHeader from "./appHeader/AppHeader.svelte";
    import AppSidebar from "./AppSidebar.svelte";
    import { s_appSidebarCollapsed } from "./s_appSidebarCollapsed";
</script>

<ModalPortal />

<div id="app-wrapper">
    <div class="app-scaffold">
        <AppSidebar />
        <AppHeader />
        {#key $navigating}
        <main
            transition:fly={{
                duration: TKN_TRANSITION.DURATION,
                easing: TKN_TRANSITION.EASING,
                x: 100
            }}
            class:fullwidth={$s_appSidebarCollapsed}><!-- px-6 py-2 -->
            <slot />
            <!--<Button>Button</Button>
            <br><br>
            <Button style="muted">Button</Button>
            <br><br>
            <Button loading>Button</Button>
            <br><br>
            <Button style="muted" loading>Button</Button>-->
        </main>
        {/key}
    </div>
</div>

<!--<div id="app-scaffold">
    <AppSidebar />
    <main>
        <AppHeader />
        <div class="content">
            <slot />
        </div>
    </main>
</div>-->

<style lang="postcss">
    #app-wrapper {
        @apply relative h-full w-full isolate;
        background-color: #ffffff;
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-color: #ffffff;
    }
    @media screen and (min-width: 768px) {
        #app-wrapper {
            @apply flex justify-center items-center;
        }
    }

    .app-scaffold {
        @apply grid h-full px-8;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-columns: min-content 1fr;
    }
    @media screen and (min-width: 768px) {
        .app-scaffold {
            @apply gap-8;
            @apply max-w-4xl mx-auto w-full h-5/6;

        }
    }

    main {
        grid-row: 2;
        grid-column: 1 / 3;
        @apply flex flex-col overflow-hidden overflow-y-scroll;
    }

    @media screen and (min-width: 768px) {
        main {
            grid-row: 2;
            grid-column: 2;
        }
        main.fullwidth {
            grid-column: 1 / -1;
        }
    }
</style>

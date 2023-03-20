<script lang="ts">
    import { navigating } from "$app/stores";
    import { Toaster } from "svelte-french-toast";
    import ModalPortal from "../modals/ModalPortal.svelte";
    import AppHeader from "./appHeader/AppHeader.svelte";
    import AppSidebar from "./AppSidebar.svelte";
</script>

<ModalPortal />

<div id="app-scaffold">
    <AppSidebar />
    <main>
        <AppHeader />
        <div class="content">
            <slot />
        </div>
    </main>
</div>

<style lang="postcss">
    #app-scaffold {
        @apply relative h-full w-full;
        @apply grid;
        grid-template-rows: 100%;
        grid-template-columns: min-content auto; /* first: min-content */
    }
    main {
        @apply flex h-full max-h-full w-full max-w-full flex-col;
        grid-row: 1;
        grid-column: 2 / 3;
    }

    .content {
        @apply w-full flex-1 grow overflow-y-scroll;
    }

    @media screen and (max-width: 768px) {
        main {
            grid-column: 1 / 3;
        }
    }
</style>

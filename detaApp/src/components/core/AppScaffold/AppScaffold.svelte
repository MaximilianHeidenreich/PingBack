<script lang="ts">
	import { navigating } from "$app/stores";
</script>
<div id="app-scaffold">
    <slot name="sidebar"/>
    <main>
        <slot name="pageHeader"/>
        {#key $navigating}
        <div class="w-full grow h-1">
            <slot name="pageContent"/>
        </div>
        {/key}
    </main>
</div>

<style lang="postcss">
    #app-scaffold {
        @apply w-full h-full relative;
        @apply grid;
        grid-template-rows: 100%;
        grid-template-columns: min-content auto;
    }
    main {
        @apply w-full h-full max-w-full max-h-full flex flex-col;
        grid-row: 1;
        grid-column: 2 / 3;
    }

    @media screen and (max-width: 768px) {
        main {
            grid-column: 1 / 3;
        }
    }
</style>
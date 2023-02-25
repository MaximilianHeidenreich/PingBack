<script>
	import IconButton from "$cmp/core/buttons/IconButton.svelte";
	import { ICON_TOKENS } from "$lib/utils/tokens";
	import { IconBrandGithub } from "@tabler/icons-svelte";
    import detaLogo from "$lib/assets/detalogo.svg";

</script>

<main id="documentation-wrapper">
    <aside>
        <div>
            <header>
                <h1>Documentation</h1>
            </header>
        </div>
        <footer>
            <ul class="flex items-center gap-1">
                <li>
                    <IconButton type="link" href="/">
                        <IconBrandGithub slot="icon" size={ICON_TOKENS.SIZE.BASE} stroke={ICON_TOKENS.STROKE.BASE} />
                    </IconButton>
                </li>
                <li>
                    <IconButton type="link" href="/">
                        <img slot="icon" src={detaLogo} alt="Deta Logo" class="w-7 aspect-square">
                    </IconButton>
                </li>
            </ul>
        </footer>
    </aside>
    <div class="content-area">
        <slot/>
    </div>
</main>

<style lang="postcss">
    main {
        @apply w-full h-full relative;
        @apply grid;
        grid-template-rows: 100%;
        grid-template-columns: min-content auto;
    }

    aside {
        grid-row: 1;
        grid-column: 1 / 2;
        @apply bg-white px-10 py-8 border-r-2 border-neutral-200;
        @apply flex flex-col justify-between;
    }
    .content-area {
        @apply w-full h-full max-h-full p-8 flex flex-col;
        grid-row: 1;
        grid-column: 2 / 3;
    }

    #documentation-wrapper :global(h1) {
        @apply text-3xl font-bold mb-4;
    }
    #documentation-wrapper :global(section + section) {
        @apply mt-10;
    }
</style>
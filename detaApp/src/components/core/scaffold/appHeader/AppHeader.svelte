<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconMenu2 } from "@tabler/icons-svelte";

</script>

<header>
    <IconButton on:click={() => {}}>
        <IconMenu2
            size={TKN_ICON.SIZE.BASE}
            stroke={TKN_ICON.STROKE.BASE} />
    </IconButton>
    <div class="flex-1 grow flex justify-between items-center">
        <span class="page-title">Page Title</span>
        <ul class="flex-1 grow flex justify-end items-center">
            <slot/>
            asd
        </ul>
    </div>
</header>

<style lang="postcss">
    header {
        @apply w-full p-5 flex justify-start items-center gap-4;
        @apply bg-white border-b-4 border-neutral-100;
    }
    .page-title {
        @apply text-xl font-medium;
    }
</style>
<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import { IconX } from "@tabler/icons-svelte";
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    // STATE
    const dispatch = createEventDispatcher();

    // HANDLERS
    function onClear() {
        dispatch("close");
    }
</script>

<div class="filters"
    transition:fly={{
        duration: TKN_TRANSITION.DURATION,
        easing: TKN_TRANSITION.EASING,
        y: -30
    }}>
    <header>
        <span class="text-lg font-medium">Filters</span>
        <span class="font-bold">·</span>
        <Button style="link">Clear</Button>
    </header>
    <footer>
        <ul>
            <li>

            </li>
            <li>
                <Button>Apply</Button>
            </li>
        </ul>
    </footer>
</div>

<style lang="postcss">
    .filters {
        @apply relative z-0;
        @apply bg-neutral-50 p-6;
        @apply border-b-4 border-neutral-100;
    }

    header {
        @apply flex items-center gap-3;
    }

    footer {
        @apply mt-4 flex justify-end;
    }
    footer ul {
        @apply flex gap-4 items-center;
    }
</style>
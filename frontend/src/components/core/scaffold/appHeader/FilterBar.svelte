<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { TKN_ICON, TKN_TRANSITION } from "$lib/utils/tokens";
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import type { IProject } from "$lib/types/IProject";
    import Input from "$cmp/core/inputs/Input.svelte";

    // PROPS
    export let query: any;

    // STATE
    const dispatch = createEventDispatcher();
    let filterValue: string = "";
    $: {
        query = filterValue;
    }

    const projects: { value: string, label: string}[] = [
        {
            value: "test",
            label: "Test",
        },
        {
            value: "project2",
            label: "Project 2",
        },
        {
            value: "pingback",
            label: "PingBack",
        },
        {
            value: "Foobar",
            label: "FooBar",
        },
        {
            value: "cool",
            label: "Cool one",
        },
        {
            value: "tester",
            label: "tester",
        },
    ];

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
    <div class="filter-body">
        <div>
            <Input bind:value={filterValue}/>
            searchbar

            searchable:
            # Text
        </div>


    </div>
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
        @apply relative z-10;
        @apply bg-neutral-50 p-6;
        @apply border-b-4 border-neutral-100;
    }

    header {
        @apply flex items-center gap-3;
    }

    .filter-body {
        @apply my-4;
    }

    footer {
        @apply mt-4 flex justify-end;
    }
    footer ul {
        @apply flex gap-4 items-center;
    }
</style>
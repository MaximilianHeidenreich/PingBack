<script lang="ts">
    import IconButton from "$cmp/core/buttons/IconButton.svelte";
    import { TKN_ICON } from "$lib/utils/tokens";
    import { IconX } from "@tabler/icons-svelte";
    import { createEventDispatcher, onMount } from "svelte";


    type TFilterElementType = "project" | "channel" | "eventName" | "text";
    interface IFilterElement {
        type: TFilterElementType;
        value: string;
    }

    // STATE
    let inputEl: HTMLInputElement;
    const dispatch = createEventDispatcher();
    let inputValue: string = "";
    let willDeleteLastFilter = false;

    let filters: IFilterElement[] = [];

    // FN
    function dispatchFilterChanged() {
        dispatch("filterChanged", buildQuery());
    }
    function buildQuery() {
        let query: { [key: string]: string } = {};
        filters.forEach(filter => {
            if (filter.type === "project") {
                query["project"] = filter.value;
            }
            else if (filter.type === "channel") {
                query["channel"] = filter.value;
            }
            else if (filter.type === "eventName") {
                query["eventName"] = filter.value;
            }
            else if (filter.type === "text") {
                query["title?contains"] = filter.value;
            }
        });
        return query;
    }
    function parseInput(input: string) {
        if (input.substring(0, 2) === "p:") {
            filters.push({
                type: "project",
                value: input.substring(2)
            })
        }
        else if (input.substring(0, 1) === "#") {
            filters.push({
                type: "channel",
                value: input.substring(1)
            })
        }
        else if (input.substring(0, 1) === ":") {
            filters.push({
                type: "eventName",
                value: input.substring(1)
            })
        }
        else {
            filters.push({
                type: "text",
                value: input
            })
        }
        filters = filters;
        inputValue = "";
        dispatchFilterChanged();
    }
    function deleteLastFilter() {
        filters.pop();
        filters = filters;
        willDeleteLastFilter = false;
        dispatchFilterChanged();
    }
    function deleteFilterAt(index: number) {
        filters.splice(index, 1);
        filters = filters;
        dispatchFilterChanged();
    }

    // HANDLERS
    function onInput() {
        //console.log(inputValue);
        if (inputValue.substring(inputValue.length - 1).match(/\s/)) {
            parseInput(inputValue);
        }
    }
    function onKeypress(e: KeyboardEvent) {
        //console.log(e);
        if (inputValue !== "") return;
        if (e.key === "Backspace") {
            if (!willDeleteLastFilter) willDeleteLastFilter = true;
            else {
                deleteLastFilter();
            }
        }
        else {
            willDeleteLastFilter = false;
        }
    }
    function onSubmit() {
        parseInput(inputValue);
    }
    function onDeleteSingleFilter(index: number) {
        deleteFilterAt(index);
    }

    // HOOKS
    onMount(() => {
        inputEl && inputEl.focus();
    });

</script>

<div class="wrapper">
    {#each filters as filter, i}
        <div class="pill {(i === filters.length - 1 && willDeleteLastFilter) ? '!bg-red-100' : ''}">
            {#if filter.type === "project"}
            <span class="text-xs font-bold text-neutral-500">Project</span>
            {:else if filter.type === "channel"}
            <span class="text-xs font-bold text-neutral-500">Channel</span>
            {:else if filter.type === "eventName"}
            <span class="text-xs font-bold text-neutral-500">Event</span>
            {/if}
            <span class="mb-0.5 text-xs font-medium">{filter.value}</span>
            <span class="cursor-pointer" on:click={() => onDeleteSingleFilter(i)}><IconX size={TKN_ICON.SIZE.SM} stroke={TKN_ICON.STROKE.SM}/></span>
        </div>
    {/each}
    <form on:submit|preventDefault={onSubmit} class="flex-1">
        <input bind:this={inputEl} class="flex-1 w-full rounded-lg text-sm" type="text" placeholder="Add Filter"
            bind:value={inputValue}
            on:input={onInput}
            on:keydown={onKeypress}>
    </form>
</div>

<style lang="postcss">
    .wrapper {
        @apply w-full flex flex-wrap items-center gap-2;
        @apply bg-red-50/0;
    }

    .pill {
        @apply flex justify-center items-center gap-2;
        @apply py-1 px-4 bg-gray-100 rounded-full;
    }
</style>
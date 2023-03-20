<script lang="ts">
    // TODO: REVIEW & REWRITE?
    // PROPS
    export let type: "text" = "text",
        value: string = "",
        sanitizer: (value: string) => string = (value) => value,
        placeholder: string = "";

    // HANDLERS
    const onInput = () => (value = sanitizer(value));
</script>

{#if type === "text"}
    <input
        type="text"
        bind:value
        on:input={onInput}
        {placeholder} />
{/if}

<style lang="postcss">
    input {
        @apply mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm;
    }
    input:focus {
        @apply border-pink-500 ring ring-neutral-400 ring-opacity-0;
    }
</style>

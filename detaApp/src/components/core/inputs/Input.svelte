<script lang="ts">

    // PROPS
    export let  type: "text" = "text",
                value: string = "",
                sanitizer: (value: string) => string = (value) => value,
                placeholder: string = "";

    // HANDLERS
    const onInput = () => value = sanitizer(value);

</script>

{#if type === "text"}
<input type="text"
    bind:value={value}
    on:input={onInput}
    {placeholder}>
{/if}

<style lang="postcss">
    input {
        @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm;
    }
    input:focus {
        @apply border-neutral-700 ring ring-neutral-400 ring-opacity-0;
    }
</style>
<script lang="ts">
    import Spinner from "../utils/Spinner.svelte";


    // PROPS
    export let type: "normal" | "ghost" | "link" = "normal",
        style: "normal" | "muted" | "red" = "normal",
        loading: boolean = false,
        disabled: boolean = false,
        clazz: string = "";

</script>

<button class="{type} s-{style}" class:loading on:click>
    <span class="content"><slot /></span>
    {#if loading}
    <span class="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center"><Spinner color="{style === "muted" ? 'dark' : 'light'}"/></span>
    {/if}
</button>

<style lang="postcss">

    button {
        @apply text-white font-medium rounded-xl;
        @apply px-5 py-3;
        @apply scale-100;
    }

    button.loading {
        @apply cursor-wait;
    }
    button.loading .content {
        @apply opacity-0;
    }

    button:active {
        @apply translate-y-0.5 scale-[0.96];
        transition: all 0.1s ease-in-out;
    }

    button.s-normal {
        @apply bg-[#2F2B43];
    }
    button.s-muted {
        @apply border bg-gray-50 text-black;
    }

</style>
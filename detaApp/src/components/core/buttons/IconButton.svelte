<script lang="ts">
    import Spinner from "../utils/Spinner.svelte";
    import Button from "./OldButton.svelte"; // TODO: Fix move to new

    // PROPS
    export let type: "button" | "link" = "button",
        style: "primary" | "secondary" | "link" = "secondary",
        color: "pink" | "red" = "pink",
        target: "_blank" | "_self" = "_self",
        href: string = "",
        disabled = false,
        clazz: string = "",
        loading = false;
</script>

<Button
    {type}
    style="secondary"
    {target}
    {href}
    {disabled}
    clazz="!p-2 {clazz} !rounded-xl relative"
    on:click
    {...$$restProps}>
    {#if loading}
    <span class="flex justify-center items-center"><Spinner color="dark"/></span>
    {:else}
    <slot />
    {/if}
</Button>

<script lang="ts">
    import Button from "./Button.svelte";

    // PROPS
    export let type: "button" | "link" = "button",
        style: "primary" | "secondary" | "link" = "secondary",
        color: "pink" | "red" = "pink",
        target: "_blank" | "_self" = "_self",
        href: string = "",
        disabled = false;
</script>

<Button {type} {style} {target} {href} {disabled} class="!border-0 !p-2" on:click {...$$restProps}>
    <slot/>
</Button>
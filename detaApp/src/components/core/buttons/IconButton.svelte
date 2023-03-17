<script lang="ts">
    import Button from "./Button.svelte";

    // PROPS
    export let type: "button" | "link" = "button",
        style: "primary" | "secondary" | "link" = "secondary",
        color: "pink" | "red" = "pink",
        target: "_blank" | "_self" = "_self",
        href: string = "",
        disabled = false,
        clazz: string = "";
</script>

<Button {type} style="secondary" {target} {href} {disabled} clazz="!p-2 {clazz}" on:click  {...$$restProps}>
    <slot/>
</Button>
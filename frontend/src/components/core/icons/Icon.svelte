<script lang="ts">
// PROPS
    export let size: number = 24, 
        strokeWidth: number = 1, 
        style: "light" | "dark" = "dark",
        fill: string | undefined = undefined;
</script>

<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" stroke-width="{strokeWidth}" class="icon {style}">
    <slot/>
</svg>



<style lang="postcss">
    .icon {

    }
    .icon.dark {
        color: black;
    }
    .icon.light {
        color: white;
    }
</style>

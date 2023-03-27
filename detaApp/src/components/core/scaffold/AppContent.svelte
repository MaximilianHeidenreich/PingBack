<script lang="ts">
    import "./scaffold.postcss";
    // PROPS
    export let style: "section" | "transparent" = "section",
        clazz = "";
</script>

<div class="app-content {style === 'section' ? 'content-area' : 'content-area-transparent'} {clazz}">
    <slot/>
</div>

<style lang="postcss">
    .app-content {
        @apply flex-1 overflow-y-auto; /* flex flex-col */
    }
</style>
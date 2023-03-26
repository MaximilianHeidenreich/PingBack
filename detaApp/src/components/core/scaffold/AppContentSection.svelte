<script lang="ts">
    // PROPS
    export let clazz = "";
</script>

<section class="content-section {clazz}" {...$$restProps}>
    <slot />
</section>

<style lang="postcss">
    .content-section {
        @apply mx-auto w-full max-w-full overflow-hidden; /* py-6 px-4 */
    }
    :global(.content-section + .content-section) {
        @apply mt-10;
    }
</style>

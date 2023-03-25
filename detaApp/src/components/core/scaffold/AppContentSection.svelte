<section {...$$restProps}>
    <slot />
</section>

<style lang="postcss">
    section {
        @apply mx-auto w-full max-w-full overflow-hidden py-6 px-4 md:max-w-2xl;
    }
</style>

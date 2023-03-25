<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";



</script>

<header>
    <div class="flex justify-end mb-8"><Button type="link" style="link">Skip tour</Button></div><!-- TODO: same level with title -->
    <h1 class="text-4xl font-bold mb-4">
        <slot name="title" />
    </h1>
    <p class="leading-relaxed max-w-lg">
        <slot name="description" />
    </p>
</header>

<style lang="postcss">
    header {
        @apply mb-8;
    }
</style>
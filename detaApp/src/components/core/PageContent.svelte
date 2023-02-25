<script lang="ts">
	import PageHeader from "./PageHeader.svelte";
    import { fly, slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

</script>

<div class="pageContent" in:fly="{{ duration: 300, delay: 300, easing: quintOut, x: 300 }}" out:fly="{{ duration: 300, easing: quintOut, x: 300 }}">
    <PageHeader />
    <div class="w-full h-full">
        <slot/>
    </div>
</div>

<style lang="postcss">
    .pageContent {
        @apply w-full h-full;
    }
</style>
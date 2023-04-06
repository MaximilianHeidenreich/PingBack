<script lang="ts">
    import TourHeader from "./TourHeader.svelte";
    import TourStep from "./TourStep.svelte";
</script>

<TourStep>
    <div class="flex-1 flex flex-col justify-center items-center text-center">
        <h1 class="text-3xl md:text-5xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-indigo-600">
            <span class="text-white mr-2">🎉</span> Have fun.
        </h1>
        <p class="leading-relaxed mt-12 max-w-lg">
            You finished the tour. Click the finish button to exit the tour and continue to the dashboard.
            Remember, further information and advanced features can be found inside our <a href="/docs" target="_blank" class="pretty-link">documentation</a>.
        </p>
    </div>
</TourStep>


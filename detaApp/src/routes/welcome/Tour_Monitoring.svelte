<script lang="ts">
    import TourHeader from "./TourHeader.svelte";
    import TourStep from "./TourStep.svelte";
</script>

<TourStep>
    <div class="flex-1 flex flex-col justify-center items-center text-center">
        <h1 class="text-3xl md:text-5xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-indigo-600">
            <span class="text-white mr-2">🔔</span> Monitor.
        </h1>
        <p class="leading-relaxed mt-12 max-w-lg">
            Watch out for future updates which will add "monitoring".
            This will allow you to create custom Notification, E-Mail or Webhook alerts whenever a specific thing happens.
            E.g. Your production system submit's an error event X times in 1 hour.
            <br>
            <a href="/docs" target="_blank" class="pretty-link">Learn more</a>. <!-- TODO: Add link -->
        </p>
    </div>
</TourStep>


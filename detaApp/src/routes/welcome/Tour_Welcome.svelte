<script lang="ts">
    import TourStep from "./TourStep.svelte";

</script>

<TourStep>
    <div class="flex-1 flex flex-col justify-center items-center text-center">
        <h1 class="text-3xl md:text-5xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-indigo-600">
            <span class="text-white">👋</span> Welcome to PingBack.
        </h1>
        <h2 class="text-xl md:text-2xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-neutral-700 to-neutral-900">
            Realtime event monitoring made simple.
        </h2>
        <p class="leading-relaxed mt-12 max-w-md">
            To get you started, the following tour will guide you through the basics of PingBack.
            Further information and advanced features can be found inside our <a href="/docs" target="_blank" class="pretty-link">documentation</a>.
        </p>
    </div>
</TourStep>

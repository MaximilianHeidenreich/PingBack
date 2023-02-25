<details
    class="info"
    open>
    <summary class="flex cursor-pointer items-center justify-between gap-2">
        <span class="message">Something went wrong!</span>
    </summary>
    <div class="content">as</div>
</details>

<details class="debug">
    <summary class="flex cursor-pointer items-center justify-between gap-2">
        <span class="message">Something went wrong!</span>
    </summary>
    <div class="content">as</div>
</details>

<details class="warning">
    <summary class="flex cursor-pointer items-center justify-between gap-2">
        <span class="message">Something went wrong!</span>
    </summary>
    <div class="content">as</div>
</details>

<details class="error">
    <summary class="flex cursor-pointer items-center justify-between gap-2">
        <span class="message">Something went wrong!</span>
    </summary>
    <div class="content">as</div>
</details>

<style lang="postcss">
    details {
        @apply mb-10;
    }
    details summary {
        @apply rounded-2xl border-2 bg-neutral-50 px-6 py-6;
        @apply flex items-center justify-between gap-2;
    }
    details summary .message {
        @apply text-lg font-medium;
    }
    details .content {
        @apply rounded-b-xl border-2 border-t-0 px-6 py-6;
    }
    details[open] summary {
        @apply rounded-b-none;
    }

    /* COLORS */
    details.debug summary,
    details.debug .content {
        @apply border-neutral-200 bg-neutral-100;
    }
    details.info summary,
    details.info .content {
        @apply border-blue-300 bg-blue-200;
    }
    details.warning summary,
    details.warning .content {
        @apply border-amber-300 bg-amber-200;
    }
    details.error summary,
    details.error .content {
        @apply border-red-300 bg-red-200;
    }
</style>

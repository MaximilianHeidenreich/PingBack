<div class="notification">
    <div class="icon-wrapper">
        <span class="icon">🔥</span>
    </div>
    <div class="meta">
        <span class="title">Something is burning</span>
        <ul class="details">
            <li>iot</li>
            <li>·</li>
            <li>today at 7:53 PM</li>
        </ul>
    </div>
</div>

<style lang="postcss">
    .notification {
        @apply flex p-5 gap-5 min-w-[40ch];
        @apply bg-white border drop-shadow-xl rounded-3xl;
    }
    .notification .icon-wrapper {
       @apply aspect-square flex justify-center items-center px-3;
       @apply bg-red-100 rounded-2xl;
    }
    .notification .icon-wrapper .icon {
        @apply text-3xl;
    }
    .notification .meta {
        @apply flex flex-col justify-between;
    }
    .notification .meta .title {
        @apply text-xl font-normal text-gray-800;
    }
    .notification .meta .details {
        @apply flex gap-3;
        @apply text-sm text-gray-500;
    }
</style>
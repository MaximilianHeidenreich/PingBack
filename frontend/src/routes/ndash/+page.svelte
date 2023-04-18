<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import AppSidebar from "$cmp/core/scaffold/AppSidebar.svelte";
    import AppHeader from "$cmp/core/scaffold/appHeader/AppHeader.svelte";
</script>

<div id="app-wrapper">
    <!-- background stuff -->

    <div class="app-scaffold">
        <AppSidebar />
        <!--<aside class="app-area !flex flex-col justify-between">
            <section>
                <header>
                    <span class="text-xl font-semibold"><span class="text-pink-500">Ping</span>Back</span>
                </header>
                <hr class="my-3">
                <ul class="m-links">
                    <li>
                        <MenuLink
                            href="/app/feed"
                            active={$page.url.pathname.startsWith("/app/feed")}>
                            <Notification />
                            <span>Feed</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/metrics"
                            active={$page.url.pathname.startsWith("/app/feed")}>
                            <Chart1 />
                            <span>Metrics</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/monitor"
                            active={$page.url.pathname.startsWith("/app/monitor")}>
                            <Notification />
                            <span>Monitor</span>
                        </MenuLink>
                    </li>
                </ul>
            </section>

            <section>
                <ul class="m-links">
                    <li>
                        <MenuLink
                            href="/app/settings"
                            active={$page.url.pathname.startsWith("/app/settings")}>
                            <Setting2 />
                            <span>Settings</span>
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            disabled
                            href="/app/asd"
                            active={$page.url.pathname.startsWith("/app/ndash")}>
                            <Chart1 />
                            <span>Help</span>
                        </MenuLink>
                    </li>
                </ul>
                <hr class="my-3">
                <ul class="flex justify-around gap-3">
                    <li><IconButton><Maximize4 size={20}/></IconButton></li>
                    <li><IconButton><Sun1 size={20}/></IconButton></li>
                </ul>
            </section>
        </aside>-->
        <AppHeader />
        <main class="app-area">
            <Button>Button</Button>
            <br><br>
            <Button style="muted">Button</Button>
            <br><br>
            <Button loading>Button</Button>
            <br><br>
            <Button style="muted" loading>Button</Button>
        </main>
    </div>
</div>

<style lang="postcss">

    /*.app-scaffold { @apply bg-neutral-100; }
    aside { @apply bg-red-200; }
    header { @apply bg-indigo-200; }
    main { @apply bg-green-200; }*/


    #app-wrapper {
        @apply relative h-full w-full;
        background-color: #ffffff;
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-color: #ffffff;
    }
    @media screen and (min-width: 768px) {
        #app-wrapper {
            @apply flex justify-center items-center;
        }
    }

    .app-scaffold {
        @apply grid h-full;
        grid-template-rows: auto 1fr;
        grid-template-columns: 15ch 1fr;
    }
    @media screen and (min-width: 768px) {
        .app-scaffold {
            @apply gap-8;
            @apply max-w-4xl mx-auto w-full h-5/6;

        }
    }

    aside {
        @apply hidden;
        /*grid-row: 0;
        grid-column: 0;*/
    }
    main {
        grid-row: 2;
        grid-column: 1 / 3;
        @apply flex-1 flex flex-col;
    }
    @media screen and (min-width: 768px) {
        aside {
            @apply block;
            grid-row: 1 / 3;
            grid-column: 1;
        }
        main {
            grid-row: 2;
            grid-column: 2;
        }
    }

    .app-area {
        @apply bg-white p-6;
    }
    @media screen and (min-width: 768px) {
        .app-area {
            @apply rounded-3xl shadow-md border-2 border-neutral-100;
        }
    }

</style>


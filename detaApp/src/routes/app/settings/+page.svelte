<script lang="ts">
    import { browser } from "$app/environment";
    import Button from "$cmp/core/buttons/Button.svelte";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import AppContentSectionHeader from "$cmp/core/scaffold/AppContentSectionHeader.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import Spinner from "$cmp/core/utils/Spinner.svelte";
    import { cache_Clear, cache_GetCache } from "$lib/client/cache";
    import { s_sysContentHash } from "$lib/stores/s_sysContentHash";
    import { sw_register } from "$lib/utils/serviceWorker";
    import { onMount } from "svelte";

    // STATE
    let dbInfo: PouchDB.Core.DatabaseInfo | null | undefined;

    // HANDLERS
    function onEnablePushNotifications() {
        sw_register();
    }
    function onClearCache() {
        cache_Clear();
    }

    // HOOKS
    onMount(async () => {
        if (!browser) return;
        try {
            dbInfo = await cache_GetCache().info();
            console.log(dbInfo);
        } catch (err) {
            console.log(err);
            dbInfo = null;
        }
    });
    s_headerTitle.set("Global Settings");

</script>

<AppContent>
    <!--<AppContentSection>
        <span class="text-lg font-medium">Notifications</span>
        <hr class="mt-2 mb-4">
        <div class="flex items-center gap-2">
            <span class="mb-0.5 font-medium">Push Notifications: </span>
            <span class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-100 bg-green-500 rounded-full">Enabled</span>
        </div>
        <Button on:click={onEnablePushNotifications}>Enable Push Notifications</Button>
        <div class="flex items-center gap-2">
            <span class="mb-0.5 font-medium">Web App Notifications: </span>
            <span class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-100 bg-green-500 rounded-full">Enabled</span>
        </div>
        status OR enable / disable
    </AppContentSection>
    <AppContentSection>
        <AppContentSectionHeader>
            <svelte:fragment slot="title">Display</svelte:fragment>
        </AppContentSectionHeader>
        <fieldset>
            <span class="font-medium mb-1">Timestamp Format</span>
            todo
        </fieldset>
    </AppContentSection>-->
    <AppContentSection>
        <span class="text-lg font-medium">Cache</span>
        <hr class="mt-2 mb-4">
        {#if dbInfo === undefined}
        <span class="flex items-center gap-2">Loading <Spinner/></span>
        {:else if dbInfo === null}
        <span>Error: Could not get cache db info...</span>
        {:else}
        <span>Size: <span class="font-mono"> {dbInfo.doc_count} timeframes</span></span><br>
        <span>Content hash: <span class="font-mono">{$s_sysContentHash}</span></span>
        <br>
        {/if}
        <br>
        <Button on:click={onClearCache} disabled={!dbInfo}>Clear Cache</Button>
    </AppContentSection>
</AppContent>

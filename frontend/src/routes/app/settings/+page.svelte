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
    import { s_timeFormat } from "$lib/stores/s_timeFormat";

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
    <AppContentSection>
        <span class="text-lg font-medium">Display</span>
        <hr class="mt-2 mb-4">
        
        <ul class="flex flex-col gap-6">
            <li>
                <ul class="flex items-center gap-3">
                    <li class="mb-0.5 font-medium"><span>Timestamp Format: </span></li>
                    <li>
                        <ul class="flex items-center">
                            <li><button on:click={() => s_timeFormat.set("relative")} class="bg-neutral-50 border rounded-l-xl px-4 py-1 {$s_timeFormat === 'relative' ? '!bg-[#2F2B43] text-white' : ''}">Relative</button></li>
                            <li><button on:click={() => s_timeFormat.set("absolute")} class="bg-neutral-50 border border-l-0 rounded-r-xl px-4 py-1 {$s_timeFormat === 'absolute' ? '!bg-[#2F2B43] text-white' : ''}">Absolute</button></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
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

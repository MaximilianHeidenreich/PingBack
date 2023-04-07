<script lang="ts">
    import { browser } from "$app/environment";
    import Button from "$cmp/core/buttons/Button.svelte";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import Spinner from "$cmp/core/utils/Spinner.svelte";
    import { cache_Clear, cache_GetCache } from "$lib/client/cache";
    import { s_sysContentHash } from "$lib/stores/s_sysContentHash";
    import Toggle from "svelte-toggle";
    import { onMount } from "svelte";
    import { s_webNotificationsEnabled } from "$lib/stores/s_webNotificationsEnabled";
    import { get, writable } from "svelte/store";
    import { supports_Notification } from "$lib/client/supports";
    import { requestNotificationPermission } from "$lib/client/notifications";
    import { s_timeFormat } from "$lib/stores/s_timeFormat";

    // STATE
    let dbInfo: PouchDB.Core.DatabaseInfo | null | undefined;
    let isWebNotificationsEnabled = writable<boolean>(get(s_webNotificationsEnabled));

    // HANDLERS
    isWebNotificationsEnabled.subscribe((state) => {
            s_webNotificationsEnabled.set(state);
        if (supports_Notification() && Notification.permission !== "granted" && state) requestNotificationPermission();
    });
    
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
    <AppContentSection>
        <span class="text-lg font-medium">Notifications</span>
        <hr class="mt-2 mb-4">
        
        <ul class="flex flex-col gap-6">
            <li>
                <ul class="flex items-center gap-3">
                    <li class="mb-0.5 font-medium"><span>Web Notifications: </span></li>
                    <li><Toggle bind:toggled={$isWebNotificationsEnabled} switchColor="#eee" toggledColor="#24a148" untoggledColor="#fa4d56" hideLabel/></li>
                </ul>
                <p><small>
                    Web Notifications only work while the web app is open.
                </small></p>
            </li>
            <li>
                <ul class="flex items-center gap-3">
                    <li class="mb-0.5 font-medium"><span>Push Notifications (Soon): </span></li>
                    <li><Toggle toggled={false} switchColor="#eee" toggledColor="#24a148" untoggledColor="#fa4d56" hideLabel disabled/></li>
                </ul>
                <p class="leading-tight"><small>
                    Push Notifications work only if the app is installed as a PWA and Web Notifications are also enabled. 
                    If enabled, you will receive notifications even if the app is closed.
                </small></p>
            </li>
        </ul>
    </AppContentSection>
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
    <!--
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

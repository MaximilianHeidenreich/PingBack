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
    import { requestNotificationPermission, subscribeToPushNotifications } from "$lib/client/notifications";
    import { s_timeFormat } from "$lib/stores/s_timeFormat";
    import { s_pushNotificationsEnabled } from "$lib/stores/s_pushNotificationsEnabled";
    import { s_clientId } from "$lib/stores/s_clientId";

    // STATE
    let dbInfo: PouchDB.Core.DatabaseInfo | null | undefined;
    let isWebNotificationsEnabled = writable<boolean>(get(s_webNotificationsEnabled));
    // let isPushNotificationsEnabled = writable<boolean>(get(s_pushNotificationsEnabled));
    
    // HANDLERS
    isWebNotificationsEnabled.subscribe((state) => {
        s_webNotificationsEnabled.set(state);
        if (supports_Notification() && Notification.permission !== "granted" && state) requestNotificationPermission();
    });
    // isPushNotificationsEnabled.subscribe((state) => {
    //     s_pushNotificationsEnabled.set(state);
    //     if (state) subscribeToPushNotifications(); // TODO: 1. if subscription saved -> dont requerst again
    // });
    
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
                    Web Notifications only work while the app is opened.
                </small></p>
            </li>
            <li>
                <ul class="flex items-center gap-3">
                    <li class="mb-0.5 font-medium"><span>Push Notifications <small>(Coming next update)</small>: </span></li>
                    <li><Toggle toggled={false} switchColor="#eee" toggledColor="#24a148" untoggledColor="#fa4d56" hideLabel disabled/></li>
                </ul>
                <p class="leading-tight"><small>
                    Push Notifications will also work if the app is closed.
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
                            <li><button on:click={() => s_timeFormat.set("relative")} class="bg-neutral-50 border rounded-l-xl px-4 py-2 {$s_timeFormat === 'relative' ? '!bg-blub-500 text-white' : ''}">Relative</button></li>
                            <li><button on:click={() => s_timeFormat.set("absolute")} class="bg-neutral-50 border border-l-0 rounded-r-xl px-4 py-2 {$s_timeFormat === 'absolute' ? '!bg-blub-500 text-white' : ''}">Absolute</button></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </AppContentSection>
    <AppContentSection>
        <span class="text-lg font-medium">Cache</span>
        <hr class="mt-2 mb-4">
        {#if dbInfo === undefined}
        <span class="flex items-center gap-2">Loading <Spinner/></span>
        {:else if dbInfo === null}
        <span>Error: Could not get cache db info...</span>
        {:else}
        <span><b>Size:</b> <span class="font-mono"> {dbInfo.doc_count} timeframes</span></span><br>
        <span><b>Content hash:</b> <span class="font-mono">{$s_sysContentHash}</span></span>
        <br>
        {/if}
        <br>
        <Button on:click={onClearCache} disabled={!dbInfo}>Clear Cache</Button>
    </AppContentSection>
    <AppContentSection>
        <span class="text-lg font-medium">Info</span>
        <hr class="mt-2 mb-4">
        <p>
            <b>Client ID:</b> <span class="font-mono">{#if browser}{$s_clientId}{/if}</span>
        </p>
    </AppContentSection>
</AppContent>

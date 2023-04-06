<script lang="ts">
    import InfiniteEventList from "$cmp/core/eventList/InfiniteEventList.svelte";
    import { s_eventListStyle } from "$cmp/core/eventList/s_eventListStyle";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import { s_filter } from "$cmp/core/scaffold/appHeader/s_filter";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";

    s_headerTitle.set("Feed");
</script>

<AppContent
    style="{$s_eventListStyle === 'compact' ? 'section' : 'transparent'}"
    clazz="{$s_eventListStyle === 'card' ? '!p-0' : ''} !p-0">
    {#key $s_filter}
    <InfiniteEventList
        query={$s_filter}
        />
    {/key}
</AppContent>
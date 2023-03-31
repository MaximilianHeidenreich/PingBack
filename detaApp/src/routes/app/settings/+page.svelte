<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import AppContentSectionHeader from "$cmp/core/scaffold/AppContentSectionHeader.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";

    import Select from "svelte-select";

    s_headerTitle.set("Global Settings");
</script>

<AppContent>
    <AppContentSection>
        <span class="text-lg font-medium">Notifications</span>
        <hr class="mt-2 mb-4">
        <div class="flex items-center gap-2">
            <span class="mb-0.5 font-medium">Push Notifications: </span>
            <span class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-100 bg-green-500 rounded-full">Enabled</span>
        </div>
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
            <p class="leading-relaxed text-neutral-700 text-sm max-w-sm">
                Display timestamps as absolute time (e.g. <span>25.09.2023 12:23</span>) or relative to the current time (e.g. <span>two hours ago.</span>).
            </p>
            <Select items={[{ value: "absolute", label: "Absolute" }, { value: "offset", label: "Offset"}]}
                clearable={false} searchable={false}></Select>
        </fieldset>
    </AppContentSection>
    <AppContentSection>
        <span class="text-lg font-medium">Cache</span>
        <hr class="mt-2 mb-4">
        <span>Size: <span class="font-mono"> 203 timeframes, 20 MB</span> </span><br>
        <span>Content hash: <span class="font-mono">eabs2-sdjhbu27s-abjss-2kjak</span></span>
        <br><br>
        <Button>Clear Cache</Button>
    </AppContentSection>
</AppContent>

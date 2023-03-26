<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
import AppContent from "$cmp/core/scaffold/AppContent.svelte";
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";

    s_headerTitle.set("Global Settings");
</script>

<AppContent>
    <AppContentSection>
        <span class="text-lg font-medium">Notifications</span>
        <hr class="mt-2 mb-4">
        status OR enable / disable
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

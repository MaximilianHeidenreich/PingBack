<script lang="ts">
    import AppContentSection from "$cmp/core/scaffold/AppContentSection.svelte";
    import { s_headerTitle } from "$cmp/core/scaffold/appHeader/s_headerTitle";
    import { onMount } from "svelte";

    s_headerTitle.set("Overview");

    onMount(() => {

    });
</script>

<AppContentSection>todo overview stats & latest events</AppContentSection>

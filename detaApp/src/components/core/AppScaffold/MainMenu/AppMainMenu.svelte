<script lang="ts">
    import CreateProjectDialog from "$cmp/dialoges/CreateProjectDialog.svelte";
    import { storeAppProjectMenuOpen } from "$lib/stores/storeAppProjectMenuOpen";
    import { storeProjects, store_fetchAllProjects } from "$lib/stores/storeProjects";
    import type { IProject } from "$lib/types/IProject";
    import { ICON_TOKENS } from "$lib/utils/tokens";
    import { openDialog } from "$lib/utils/utils";
    import { IconHome, IconPlus, IconQuestionMark, IconUser } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    import { get } from "svelte/store";

    import ProjectSwitcher from "./ProjectSwitcher.svelte";
    import RoundMenuButton from "./RoundMenuButton.svelte";

    // STATE
    /*let projects: IProject[] = [
        {
            id: "test-project",
            channels: [
                { name: "general", notify: true },
                { name: "logs", notify: false },
                { name: "payments", notify: true },
            ],
            createdAt: 0,
            name: "Test-Project"
        },
        {
            id: "art",
            channels: [
                { name: "foo", notify: true },
                { name: "bar", notify: true },
            ],
            createdAt: 0,
            name: "Art"
        },
        { id: "foo",channels: [],createdAt: 0,name: "Foo"},
        { id: "foo",channels: [],createdAt: 0,name: "Foo"},
    ];*/

    // HOOKS
    onMount(() => {
        store_fetchAllProjects();
    });
</script>

<div class="mainMenu">
    <div class="flex h-full max-h-full grow flex-col">
        <header>
            <ul class="flex flex-col gap-4">
                <li>
                    <RoundMenuButton
                        type="link"
                        href="/app/dashboard">
                        <IconHome
                            size={ICON_TOKENS.SIZE.LG}
                            stroke={ICON_TOKENS.STROKE.BASE} />
                    </RoundMenuButton>
                </li>
                <li>
                    <RoundMenuButton on:click={() => openDialog(CreateProjectDialog)}>
                        <IconPlus
                            size={ICON_TOKENS.SIZE.LG}
                            stroke={ICON_TOKENS.STROKE.BASE} />
                    </RoundMenuButton>
                </li>
            </ul>
            <hr class="my-3 mx-auto w-2/3" />
        </header>

        <div class="grow overflow-y-auto">
            <!-- TODO: FIX myn overflow-->
            <ProjectSwitcher projects={$storeProjects} />
        </div>
    </div>

    <footer>
        <hr class="my-3 mx-auto w-2/3" />
        <ul class="flex flex-col gap-4">
            <li>
                <RoundMenuButton
                    type="link"
                    target="_blank"
                    href="https://maximilianheidenreich.gitbook.io/pingback/">
                    <IconQuestionMark
                        size={ICON_TOKENS.SIZE.LG}
                        stroke={ICON_TOKENS.STROKE.BASE} />
                </RoundMenuButton>
            </li>
            <li>
                <RoundMenuButton
                    type="link"
                    href="/app/settings">
                    <IconUser
                        size={ICON_TOKENS.SIZE.LG}
                        stroke={ICON_TOKENS.STROKE.BASE} />
                </RoundMenuButton>
            </li>
        </ul>
    </footer>
</div>

<style lang="postcss">
    .mainMenu {
        @apply relative h-full max-h-full border-r-2 border-neutral-100 p-4;
        @apply flex flex-col justify-between;
    }
</style>

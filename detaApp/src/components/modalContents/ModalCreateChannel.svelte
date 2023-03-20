<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { s_appSidebarFetchAllProjects } from "$cmp/core/scaffold/s_appSidebarProjects";
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import { clientCreateProjectChannelRaw } from "$lib/helpers/api/projectsClient";
    import type { IChannel } from "$lib/types/IChannel";
    import type { IProject } from "$lib/types/IProject";
    import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let project: IProject;

    // STATE
    let dialog: HTMLDialogElement;
    let channelID: string;

    // HANDLERS
    function reset() {
        channelID = "";
    }
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        const res = await clientCreateProjectChannelRaw(fetch, sanitizeProjectIdInput(project.key),
            { id: channelID }
        );
        console.debug("Create channel fetch result", res);

        if (res.status === 200) {
            toast.success("Created project!", toastOptions());
            const body = (await res.json()) as IChannel;
            //s_appSidebarFetchAllProjects();
            s_projectSidebarActiveProject.update(project => {
                if (project)
                    project.channels = [...project?.channels ?? [], body];
                return project;
            });
            dialog.close();
            return;
        }
        else if (res.status === 400) {
            toast.error("Could not create channel!", toastOptions());
        }
        else if (res.status === 409) {
            toast.error("Channel already exists!", toastOptions());
        }

        reset();
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Channel</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Use channels to split events into easily accessible groups.
        Visit the <a href="https://maximilianheidenreich.gitbook.io/pingback/" target="_blank" class="pretty-link">documentation</a> for more information. <!-- TODO: Link -->
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Channel ID</span>
                <Input
                    bind:value={channelID}
                    sanitizer={sanitizeProjectIdInput}
                    placeholder="general" /> <!-- TODO: space input should auto replace on input -->
            </label>
            <p class="mt-2 max-w-[35ch] px-0.5 leading-5">
                <small class="mt-1">
                    Allowed characters: lowercase letters, numbers, dashes and underscores.
                </small>
            </p>
        </fieldset>
        <!-- TODO: Add notify checkbox -->
    </svelte:fragment>
    <svelte:fragment slot="footer">
    <div class="flex justify-end gap-4">
        <Button style="secondary" on:click={onCancel}>Cancel</Button>
        <Button on:click={onCreate}>Create</Button>
    </div>
    </svelte:fragment>
</Modal>
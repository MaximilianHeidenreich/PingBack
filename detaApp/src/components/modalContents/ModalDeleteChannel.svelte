<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { s_projectSidebarActiveProject } from "$cmp/core/scaffold/s_projectSidebarActiveProject";
    import {
        clientDeleteProjectChannelRaw,
        clientDeleteProjectRaw
    } from "$lib/helpers/api/projectsClient";
    import type { IProject } from "$lib/types/IProject";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let project: IProject, channelID: string, onDeleted: () => void;

    // STATE
    let dialog: HTMLDialogElement;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onDelete() {
        const res = await clientDeleteProjectChannelRaw(fetch, project.key, channelID);
        console.debug("Delete channel fetch result", res);

        if (res.status === 200) {
            toast.success("Deleted channel!", toastOptions());
            s_projectSidebarActiveProject.update((project) => {
                if (project) project.channels = project.channels.filter((e) => e.id !== channelID);
                return project;
            });
        } else {
            toast.error("Could not delete channel!", toastOptions());
        }

        dialog.close();
        onDeleted && onDeleted();
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Delete Channel</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Are you sure you want to delete <strong class="font-mono text-pink-500">#{channelID}</strong
        >? This action cannot be reversed -> in the future it will be possible to migrate events to
        another channel though.
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="secondary"
                on:click={onCancel}>Cancel</Button>
            <Button
                on:click={onDelete}
                color="red">Delete</Button>
        </div>
    </svelte:fragment>
</Modal>

<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { clientDeleteProjectChannelRaw } from "$lib/helpers/api/projectsClient";
    import type { IProject } from "@pingback/shared";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let project: IProject, channelID: string, onDeleted: () => void;

    // STATE
    let dialog: HTMLDialogElement;
    let working = false;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onDelete() {
        working = true;
        const res = await clientDeleteProjectChannelRaw(fetch, project.key, channelID);

        if (res.status === 200) {
            toast.success(`Deleted channel #${channelID}!`, toastOptions());
            dialog.close();
            onDeleted && onDeleted();
            return;
        } else {
            toast.error(`Could not delete channel #${channelID}!`, toastOptions());
        }
        working = false;
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Delete Channel</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Are you sure you want to delete <strong class="font-mono text-blub-500">#{channelID}</strong
        >?
    </svelte:fragment>
    <!--<svelte:fragment slot="body">
        <fieldset>
            todo: checkbox delete associated events.
        </fieldset>
    </svelte:fragment>--> <!-- TODO: impl -->
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="muted"
                on:click={onCancel}>Cancel</Button>
            <Button
                on:click={onDelete}
                loading={working}
                style="red">Delete</Button>
        </div>
    </svelte:fragment>
</Modal>

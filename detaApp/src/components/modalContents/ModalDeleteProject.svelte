<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { clientDeleteProjectRaw } from "$lib/helpers/api/projectsClient";
    import type { IProject } from "$lib/types/IProject";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let project: IProject, onDeleted: () => void;

    // STATE
    let dialog: HTMLDialogElement;
    let working = false;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onDelete() {
        working = true;
        const res = await clientDeleteProjectRaw(fetch, project.key);
        console.debug("Delete project fetch result", res);

        if (res.status === 200) {
            toast.success("Deleted project!", toastOptions());
            dialog.close();
            onDeleted && onDeleted();
            return;
        } else {
            toast.error(`Could not delete project ${project.key}!`, toastOptions());
        }
        working = false;
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Delete Project</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Are you sure you want to delete the project <strong class="text-pink-500"
            >{project.displayName}</strong
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

<script lang="ts">
    import Button from "$cmp/core/buttons/Button.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { clientCreateProjectRaw } from "$lib/helpers/api/projectsClient";
    import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // PROPS
    export let onCreated: () => void;

    // STATE
    let dialog: HTMLDialogElement;
    let projectName: string;
    let working = false;

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        working = true;
        const res = await clientCreateProjectRaw(fetch, {
            key: sanitizeProjectIdInput(projectName),
            displayName: projectName
        });

        if (res.status === 200) {
            toast.success("Created project!", toastOptions());
            dialog.close();
            onCreated && onCreated();
            return;
        } else if (res.status === 400) {
            console.error(await res.json());
            toast.error("Could not create project!", toastOptions());
        } else if (res.status === 409) {
            toast.error(`Project ${projectName} already exists!`, toastOptions());
        }
        working = false;
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Project</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Use projects to split events, metrics and monitors into separate groups. Visit the <a
            href="/docs"
            target="_blank"
            class="pretty-link">documentation</a>
        for more information.
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Project Name</span>
                <Input
                    bind:value={projectName}
                    sanitizer={sanitizeProjectIdInput}
                    placeholder="My-Project" />
            </label>
            <p class="mt-2 max-w-[35ch] px-0.5 leading-5">
                <small class="mt-1">
                    Allowed characters: lowercase letters, numbers, dashes and underscores.
                </small>
            </p>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="muted"
                on:click={onCancel} disabled={working}>Cancel</Button>
            <Button on:click={onCreate} loading={working}>Create</Button>
        </div>
    </svelte:fragment>
</Modal>

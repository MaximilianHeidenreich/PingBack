<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { sanitizeApiKeyName } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // STATE
    let dialog: HTMLDialogElement;
    let keyName: string;

    // FN
    function reset() {
        keyName = "";
    }

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        // TODO: impl
        /*const res = await clientCreateProjectRaw(fetch, {
            key: sanitizeProjectIdInput(projectName),
            displayName: projectName,
        });
        console.debug("Create project fetch result", res);

        if (res.status === 200) {
            toast.success("Created project!", toastOptions());
            dialog.close();
            const body = (await res.json()) as IProject;
            s_appSidebarProjects.update(projects => {
                projects = [...projects, body];
                return projects;
            });
            return;
        }
        else if (res.status === 400) {
            toast.error("Could not create project!", toastOptions());
        }
        else if (res.status === 409) {
            toast.error("Prokect already exists!", toastOptions());
        }
        */
        reset();
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Api Key</svelte:fragment>
    <svelte:fragment slot="subtitle">
        API Keys are used to authenticate requests to your project. You cannot create events without
        an API Key. Visit the <a
            href="https://maximilianheidenreich.gitbook.io/pingback/"
            target="_blank"
            class="pretty-link">documentation</a>
        for more information. <!-- TODO: Link -->
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Key Name</span>
                <Input
                    bind:value={keyName}
                    sanitizer={sanitizeApiKeyName}
                    placeholder="Example Application" />
            </label>
            <p class="mt-2 px-0.5 leading-5">
                <small class="mt-1">
                    Use a descriptive name for your key. This will help you identify it later.
                </small>
            </p>
        </fieldset>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="flex justify-end gap-4">
            <Button
                style="secondary"
                on:click={onCancel}>Cancel</Button>
            <Button on:click={onCreate}>Create</Button>
        </div>
    </svelte:fragment>
</Modal>

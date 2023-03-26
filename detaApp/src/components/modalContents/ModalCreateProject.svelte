<script lang="ts">
    import Button from "$cmp/core/buttons/OldButton.svelte";
    import Input from "$cmp/core/inputs/Input.svelte";
    import Modal from "$cmp/core/modals/Modal.svelte";
    import { s_appSidebarProjects } from "$cmp/core/scaffold/s_appSidebarProjects";
    import { clientCreateProjectRaw } from "$lib/helpers/api/projectsClient";
    import type { IProject } from "$lib/types/IProject";
    import { sanitizeProjectIdInput } from "$lib/utils/sanitizers";
    import toastOptions from "$lib/utils/toast";
    import toast from "svelte-french-toast";

    // STATE
    let dialog: HTMLDialogElement;
    let projectName: string;

    // FN
    function reset() {
        projectName = "";
    }

    // HANDLERS
    function onCancel() {
        dialog.close();
    }
    async function onCreate() {
        const res = await clientCreateProjectRaw(fetch, {
            key: sanitizeProjectIdInput(projectName),
            displayName: projectName
        });
        console.debug("Create project fetch result", res);

        if (res.status === 200) {
            toast.success("Created project!", toastOptions());
            const body = (await res.json()) as IProject;
            s_appSidebarProjects.update((projects) => {
                projects = [...projects, body];
                return projects;
            });
            dialog.close();
            return;
        } else if (res.status === 400) {
            toast.error("Could not create project!", toastOptions());
        } else if (res.status === 409) {
            toast.error("Prokect already exists!", toastOptions());
        }

        reset();
    }
</script>

<Modal bind:dialog>
    <svelte:fragment slot="title">Create Project</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Use projects to split events, metrics and monitors into separate groups. Visit the <a
            href="https://maximilianheidenreich.gitbook.io/pingback/"
            target="_blank"
            class="pretty-link">documentation</a>
        for more information. <!-- TODO: Link -->
    </svelte:fragment>
    <svelte:fragment slot="body">
        <fieldset>
            <label class="block">
                <span class="text-gray-700">Project Name</span>
                <Input
                    bind:value={projectName}
                    sanitizer={sanitizeProjectIdInput}
                    placeholder="My-Project" />
                <!-- TODO: space input should auto replace on input -->
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
                style="secondary"
                on:click={onCancel}>Cancel</Button>
            <Button on:click={onCreate}>Create</Button>
        </div>
    </svelte:fragment>
</Modal>

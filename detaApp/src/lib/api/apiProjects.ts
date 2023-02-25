import type { IChannel, IProject } from "$lib/types/IProject";

/**
 * Generator to fetch projects.
 * @param limit Max number of projects to fetch at once
 */
export async function* fetchProjects(limit: number = 20, query: unknown) {
    let last = undefined;
    const request = async (
        lastKey: string | undefined,
        query: unknown | undefined
    ): Promise<{ count: number; last: string | undefined; items: IProject[] }> => {
        // TODO: Use built-in URL class
        let uri = `/api/projects?limit=${limit}`;
        if (lastKey) uri += `&last=${lastKey}`;
        if (query) uri += `&query=${btoa(JSON.stringify(query))}`;

        const response = await fetch(uri, {
            method: "GET"
        });
        const json = await response.json();

        last = json.data.last;
        return json.data;
    };

    yield await request(last, query);
    while (last) {
        yield await request(last, query);
    }
}
export async function fetchAllProjects(query?: unknown) {
    const projects: IProject[] = [];
    for await (const res of fetchProjects(100, query)) {
        projects.push(...res.items);
    }
    return projects;
    // TODO: REMOVE timeout dev only!
    const p = new Promise<IProject[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(projects);
        }, 1000);
    });
    return p;
}

type TCreateProjectArgs = Pick<IProject, "name">;
export async function createProject(project: TCreateProjectArgs) {
    const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });
    const json = await response.json();
    return json.data;
}

/* PROJECT CHANNELS */
type TCreateProjectChannelArgs = Pick<IChannel, "name" | "notify">;
export async function createProjectChannel(projectID: string, channel: TCreateProjectChannelArgs) {
    const response = await fetch(`/api/projects/${projectID}/channels`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(channel)
    });
    const json = await response.json();
    return json.data;
}

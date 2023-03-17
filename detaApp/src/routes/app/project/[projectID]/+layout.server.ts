import { db_projects } from "$lib/server/deta";
import type { IProject } from "$lib/types/IProject";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";

import type { LayoutServerLoad } from "./$types";

export const load = (async ({ params, depends }) => {
    const { projectID } = params;

    //depends("app:projectID");

    let project: IProject | null;
    project = await db_projects.get(sanitizeProjectIdInternal(projectID));

    return {
        project,
        projectID,
    };
}) satisfies LayoutServerLoad;

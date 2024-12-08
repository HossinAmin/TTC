import { v7 } from "uuid";
import type { Project } from "~/types/Project";

export default function useProjects() {
  const projects = useState<Project[] | null>("projects");
  const { $db } = useNuxtApp();

  const getProjects = async () => {
    projects.value = await $db.select<Project[]>(`select * from Projects`);
  };

  const getProject = async (
    projectId: string,
  ): Promise<Project | undefined> => {
    projects.value = null;

    const results = await $db.select<Project[]>(
      "SELECT * FROM Projects WHERE id = $1",
      [projectId],
    );

    return results?.[0];
  };

  const createProject = async (name: string, desc?: string) => {
    const id = v7();

    await $db.execute(
      "INSERT INTO Projects (id, name, description) VALUES ($1, $2, $3)",
      [id, name, desc],
    );

    await getProjects();
  };

  const deleteProject = async (id: string) => {
    await $db.execute("DELETE FROM Projects WHERE id = $1", [id]);
    await getProjects();
  };

  const updateProject = async (id: string, name: string, desc?: string) => {
    await $db.execute(
      "UPDATE Projects SET name = $1, description = $2 WHERE id = $3",
      [name, desc, id],
    );
    await getProjects();
  };

  const updateProjectTime = async (id: string, time: number) => {
    await $db.execute("UPDATE Projects SET time = $2 WHERE id = $1", [
      id,
      time,
    ]);
  };

  return {
    projects,
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    updateProjectTime,
  };
}

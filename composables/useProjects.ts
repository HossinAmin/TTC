import { v7 } from "uuid";
import type { Project } from "~/types/Project";

export default function useProjects() {
  const projects = useState<Project[] | null>("projects");
  const currentProject = useState<Project | undefined>("current-project");
  const { $db } = useNuxtApp();

  const getProjects = async () => {
    projects.value = null;
    projects.value = await $db.select<Project[]>(`select * from Projects`);
  };

  const getProject = async (
    projectId: string,
  ): Promise<Project | undefined> => {
    const results = await $db.select<Project[]>(
      "SELECT * FROM Projects WHERE id = $1",
      [projectId],
    );

    return results?.[0];
  };

  const createProject = async (name: string, desc?: string, link?: string) => {
    const id = v7();

    await $db.execute(
      "INSERT INTO Projects (id, name, description, link) VALUES ($1, $2, $3, $4)",
      [id, name, desc, link],
    );

    await getProjects();
  };

  const deleteProject = async (id: string) => {
    await $db.execute("DELETE FROM Projects WHERE id = $1", [id]);
    await getProjects();
  };

  const editProject = async (
    id: string,
    name: string,
    desc?: string,
    link?: string,
  ) => {
    await $db.execute(
      "UPDATE Projects SET name = $2, description = $3, link = $4 WHERE id = $1",
      [id, name, desc, link],
    );
    await getProjects();
  };

  const updateProject = async (
    id: string,
    time: number,
    tasks_count: number,
  ) => {
    await $db.execute(
      "UPDATE Projects SET time = $2, tasks_count = $3 WHERE id = $1",
      [id, time, tasks_count],
    );
  };

  return {
    projects,
    currentProject,
    getProjects,
    getProject,
    createProject,
    deleteProject,
    editProject,
    updateProject,
  };
}

import { v7 } from "uuid";
import type { Project } from "~/types/Project";

export default function useProjects() {
  const projects = useState<Project[] | null>("projects");
  const { $db } = useNuxtApp();

  const getProjects = async () => {
    projects.value = await $db.select<Project[]>(`select * from Projects`);
  };

  const createProject = async (name: string, desc?: string) => {
    const id = v7();

    await $db.execute(
      "INSERT INTO projects (id, name, description) VALUES ($1, $2, $3)",
      [id, name, desc],
    );

    await getProjects();
  };

  const deleteProject = async (id: string) => {
    await $db.execute("DELETE FROM projects WHERE id = $1", [id]);
    projects.value = null;
    await getProjects();
  };

  const updateProject = async (id: string, name: string, desc?: string) => {
    await $db.execute(
      "UPDATE Projects SET name = $1, description = $2 WHERE id = $3",
      [name, desc, id],
    );
    projects.value = null;
    await getProjects();
  };

  return {
    projects,
    getProjects,
    createProject,
    deleteProject,
    updateProject,
  };
}

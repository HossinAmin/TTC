import { v7 } from "uuid";
import type { Task } from "~/types/Tasks";

export default function useTasks(projectId: string) {
  const tasks = useState<Task[] | null>("tasks");

  const totalTime = computed(
    () =>
      tasks.value?.reduce((acc, task) => {
        return acc + task.time;
      }, 0) ?? 0,
  );

  const { updateProject } = useProjects();
  const { $db } = useNuxtApp();

  const getTasks = async () => {
    tasks.value = null;
    tasks.value = await $db.select<Task[]>(
      "SELECT * FROM Tasks WHERE project = $1",
      [projectId],
    );
  };

  const getTask = async (taskId: string): Promise<Task | undefined> => {
    const results = await $db.select<Task[]>(
      "SELECT * FROM Tasks WHERE id = $1",
      [taskId],
    );

    return results?.[0];
  };

  const createTask = async (name: string, desc?: string, link?: string) => {
    const id = v7();

    await $db.execute(
      "INSERT INTO Tasks (id, name, description, project, link) VALUES ($1, $2, $3, $4, $5)",
      [id, name, desc ?? null, projectId, link ?? null],
    );

    await getTasks();
  };

  const deleteTask = async (id: string) => {
    await $db.execute("DELETE FROM Tasks WHERE id = $1", [id]);
    await getTasks();
  };

  const editTask = async (
    id: string,
    name: string,
    desc?: string,
    link?: string,
  ) => {
    await $db.execute(
      "UPDATE Tasks SET name = $2, description = $3, link = $4 WHERE id = $1",
      [id, name, desc, link],
    );
    await getTasks();
  };

  const updateTaskTime = async (id: string, time: number) => {
    await $db.execute("UPDATE Tasks SET time = $2 WHERE id = $1", [id, time]);
  };

  watch(tasks, () => {
    updateProject(projectId, totalTime.value, tasks.value?.length ?? 0);
  });

  return {
    tasks,
    totalTime,
    getTasks,
    getTask,
    createTask,
    deleteTask,
    editTask,
    updateTaskTime,
  };
}

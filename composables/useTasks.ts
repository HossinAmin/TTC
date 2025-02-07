import { v7 } from "uuid";
import type { Task } from "~/types/Tasks";

export default function useTasks(projectId: string) {
  const tasks = ref<Task[] | null>();

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

  const saveTasks = async () => {
    try {
      if (!tasks.value?.length) return;

      const updates = tasks.value.map(
        (task) => `
        UPDATE Tasks 
        SET name = '${task.name}',
            description = ${task.description ? `'${task.description}'` : "NULL"},
            project = '${task.project}',
            time = ${task.time},
            link = ${task.link ? `'${task.link}'` : "NULL"}
        WHERE id = '${task.id}'`,
      );

      const query = updates.join(";");
      console.log(query);

      await $db.execute(query);
    } catch (error) {
      console.error("Failed to bulk update tasks:", error);
      throw error;
    }
  };

  return {
    tasks,
    getTasks,
    getTask,
    createTask,
    deleteTask,
    editTask,
    updateTaskTime,
    saveTasks,
  };
}

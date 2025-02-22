<template>
  <div
    class="flex w-full flex-grow flex-col gap-10 p-5 transition-all delay-100"
  >
    <ProjectHeader :project="currentProject" />

    <TasksList
      v-if="$route.params.id"
      :projectId="$route.params.id.toString()"
      @edit="handleEdit"
      @delete="confirmTaskDeletion"
    />
    <p v-else>Loading ...</p>

    <button
      class="fixed bottom-10 end-10 flex items-center justify-center rounded-full border border-solid border-black bg-primary p-3 font-bold shadow-2xl"
      @click="handleCreateTask"
    >
      <Icon class="text-4xl font-bold" name="ic:round-plus" />
    </button>

    <TasksModal v-model:is-open="isTaskModalOpen" :task="selectedTask" />
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/Tasks";

const isTaskModalOpen = ref(false);
const selectedTask = ref<Task>();

const route = useRoute();
const { currentProject } = useProjects();
const { deleteTask, getTasks } = useTasks(route.params.id.toString());
const { show: showConfirmationModal } = useConfModal();

const confirmTaskDeletion = (task: Task) => {
  showConfirmationModal("delete this task", () => {
    deleteTask(task.id);
    getTasks();
  });
};

const handleEdit = (task: Task) => {
  isTaskModalOpen.value = true;
  selectedTask.value = task;
};

const handleCreateTask = () => {
  selectedTask.value = undefined;
  isTaskModalOpen.value = true;
};
</script>

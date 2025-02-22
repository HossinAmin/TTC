<template>
  <div
    class="flex w-full flex-grow flex-col gap-10 p-5 transition-all delay-100"
  >
    <nav
      class="grid w-full grid-cols-[minmax(0,5fr),auto] items-end justify-between"
    >
      <div class="flex flex-col gap-2">
        <h1 class="truncate text-ellipsis text-4xl">
          {{ currentProject?.name }}
        </h1>
        <p class="truncate text-ellipsis text-lg text-text-light">
          {{ currentProject?.description }}
        </p>
      </div>

      <p class="text-end text-xl">
        {{ timer?.hours }}:{{ timer?.minutes }}:{{ timer?.seconds }}
      </p>
    </nav>

    <TasksList
      v-if="$route.params.id"
      :projectId="$route.params.id.toString()"
      @edit="handleEdit"
      @delete="openDeleteModal"
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
import useTasks from "~/composables/useTasks";
import type { Task } from "~/types/Tasks";

const isTaskModalOpen = ref(false);
const selectedTask = ref<Task>();

const route = useRoute();

const { currentProject } = useProjects();
const { show: showConfirmationModal } = useConfModal();

const { deleteTask } = useTasks(route.params.id.toString());

const timer = computed(() => {
  const time = sec2TimeObj(currentProject.value?.time ?? 0);

  return {
    hours: pad(time.h),
    minutes: pad(time.m),
    seconds: pad(time.s),
  };
});

const handleEdit = (task: Task) => {
  isTaskModalOpen.value = true;
  selectedTask.value = task;
};

const handleCreateTask = () => {
  selectedTask.value = undefined;
  isTaskModalOpen.value = true;
};

const openDeleteModal = (task: Task) =>
  showConfirmationModal("delete this task", () => deleteTask(task.id));
</script>

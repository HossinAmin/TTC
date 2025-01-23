<template>
  <div class="flex w-full flex-col gap-10 p-5">
    <nav class="flex w-full items-center justify-between px-4">
      <div class="flex w-60 flex-col gap-2 truncate">
        <h1 class="text-4xl">{{ currentProject?.name }}</h1>
        <p class="text-lg text-text-light">
          {{ currentProject?.description }}
        </p>
      </div>

      <p class="text-4xl">
        {{ timer?.hours }}:{{ timer?.minutes }}:{{ timer?.seconds }}
      </p>

      <div class="w-60" />
    </nav>

    <template v-if="tasks">
      <TasksCard
        v-if="tasks.length !== 0"
        v-for="task in tasks"
        :task
        :playingTaskId
        @play="handlePlay"
        @edit="handleEdit(task)"
        @delete="openDeleteModal(task)"
      />
      <CommonEmptyIndicator v-else item-name="Tasks" />
    </template>
    <p v-else>Loading ...</p>
  </div>

  <button
    class="fixed bottom-10 end-10 flex items-center justify-center rounded-full border border-solid border-black bg-primary p-3 font-bold shadow-2xl"
    @click="handleCreateTask"
  >
    <Icon class="text-4xl font-bold" name="ic:round-plus" />
  </button>

  <TasksModal v-model:is-open="isTaskModalOpen" :task="selectedTask" />
</template>

<script setup lang="ts">
import useTasks from "~/composables/useTasks";
import type { Task } from "~/types/Tasks";

const isTaskModalOpen = ref(false);

const selectedTask = ref<Task>();
const playingTaskId = ref<string>();

const route = useRoute();

const { currentProject } = useProjects();
const { show } = useConfModal();

const { tasks, totalTime, getTasks, deleteTask } = useTasks(
  route.params.id as string,
);

const { seconds, time, pad } = useTimer(totalTime.value);

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

const handlePlay = (taskId: string) => {
  if (taskId === playingTaskId.value) {
    playingTaskId.value = undefined;
  } else {
    playingTaskId.value = taskId;
  }
};

const handleEdit = (task: Task) => {
  isTaskModalOpen.value = true;
  selectedTask.value = task;
};

const handleCreateTask = () => {
  selectedTask.value = undefined;
  isTaskModalOpen.value = true;
};

const openDeleteModal = (task: Task) => {
  selectedTask.value = task;
  show("delete this task", () => deleteTask(task.id));
};

onMounted(async () => {
  await getTasks();
  seconds.value = totalTime.value;
});
</script>

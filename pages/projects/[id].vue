<template>
  <div class="flex w-full flex-col gap-10 p-5">
    <nav class="flex w-full items-center justify-between px-4">
      <div class="flex w-60 flex-col gap-2 truncate">
        <h1 class="text-4xl">{{ currentProject?.name }}</h1>
        <p class="truncate text-lg text-text-light">
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
        :hide-time="isFloatingTimerOpen && task.id == playingTaskId"
        @play="handlePlay(task.id)"
        @open-floating-timer="handleOpenFloatingTimer(task)"
        @edit="handleEdit(task)"
        @delete="openDeleteModal(task)"
      />
      <CommonEmptyIndicator v-else item-name="Tasks" />
    </template>
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
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { FloatingTimerPayload } from "~/types/Time";

const isTaskModalOpen = ref(false);
const isFloatingTimerOpen = ref(false);
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
    // if floating window is open close all timers
    if (isFloatingTimerOpen.value) {
      invoke("close_floating_timer", {
        taskId: playingTaskId.value,
        isPlaying: false,
      });
      isFloatingTimerOpen.value = false;
      playingTaskId.value = undefined;
    } else {
      playingTaskId.value = taskId;
    }
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
  show("delete this task", () => deleteTask(task.id));
};

const handleOpenFloatingTimer = async (task: Task) => {
  await invoke("open_floating_timer", {
    taskId: task.id,
    time: task.time,
    isPlaying: playingTaskId.value === task.id,
  });
  isFloatingTimerOpen.value = true;
};

listen<FloatingTimerPayload>("close-floating-timer", async (event) => {
  await getTasks();
  isFloatingTimerOpen.value = false;
});

onMounted(async () => {
  await getTasks();
  seconds.value = totalTime.value;
});
</script>

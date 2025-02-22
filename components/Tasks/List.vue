<template>
  <div class="flex flex-col gap-4">
    <TasksCard
      v-if="tasks?.length"
      v-for="task in tasks"
      v-bind="task"
      :time="playingTask?.id === task.id && play ? seconds : task.time"
      :is-playing="playingTask?.id === task.id && play"
      :hide-time="playingTask?.id === task.id && isFloatingTimerOpen"
      @toggle-timer="handlePlay(task)"
      @open-floating-timer="handleOpenFloatingTimer(task)"
      @edit="$emit('edit', task)"
      @delete="$emit('delete', task)"
    />
    <CommonEmptyIndicator v-else item-name="Tasks" />
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/Tasks";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { FloatingTimerPayload } from "~/types/Time";

const props = defineProps<{
  projectId: string;
}>();

const isFloatingTimerOpen = ref(false);
const playingTask = ref<Task>();

const { play, seconds } = useTimer();
const { tasks, getTasks, saveTasks } = useTasks(props.projectId);
const { startTracking, stopTracking } = useActivityTracker();

const updateTasksLocally = () => {
  const taskIndex =
    tasks.value?.findIndex((item) => item.id === playingTask.value?.id) ?? -1;

  if (tasks.value?.[taskIndex]) {
    tasks.value[taskIndex].time = seconds.value;
  }
};

const handlePlay = async (task: Task) => {
  // no playing task or switch bettwen playing tasks
  if (task.id !== playingTask.value?.id) {
    updateTasksLocally();
    playingTask.value = task;
    seconds.value = task.time;
    play.value = true;
  }
  // the playing tasks emits play event
  else if (task.id === playingTask.value?.id && play.value) {
    updateTasksLocally();
    play.value = false;
    playingTask.value = undefined;
  }
};

const handleOpenFloatingTimer = async (task: Task) => {
  play.value = false;
  isFloatingTimerOpen.value = true;
  await invoke("open_floating_timer", {
    taskId: task.id,
    time: task.time,
    isPlaying: play.value,
  });
};

// sync tasks in DB every 30 seconds and on timer pause
let timerId: NodeJS.Timeout;
watch(play, () => {
  if (play.value) {
    startTracking();
    timerId = setInterval(() => {
      if (playingTask.value) {
        saveTasks();
      }
    }, 30 * 1000);
  } else {
    clearInterval(timerId);
    stopTracking();
  }
});

onMounted(async () => {
  await getTasks();
});

listen<FloatingTimerPayload>("close-floating-timer", async () => {
  await getTasks();
  playingTask.value = undefined;
  isFloatingTimerOpen.value = false;
});

onUnmounted(() => {
  clearInterval(timerId);
  stopTracking();
});
</script>

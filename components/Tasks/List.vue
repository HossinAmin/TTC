<template>
  <div class="flex flex-col gap-4">
    <TasksCard
      v-if="tasks?.length"
      v-for="(task, index) in tasks"
      v-bind="task"
      :time="playingTask?.id === task.id && play ? seconds : task.time"
      :is-playing="playingTask?.id === task.id && play"
      :hide-time="playingTask?.id === task.id && isFloatingTimerOpen"
      @toggle-timer="handlePlay(task, index)"
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

const handlePlay = async (task: Task, index: number) => {
  if (tasks.value) {
    if (!playingTask.value) {
      playingTask.value = task;
      seconds.value = task.time;
      play.value = true;
    } else if (task.id === playingTask.value?.id && play.value) {
      play.value = false;
      playingTask.value = undefined;
      tasks.value[index].time = seconds.value;
    } else {
      const taskIndex = tasks.value.findIndex(
        (item) => item.id === playingTask.value?.id,
      );
      console.log(taskIndex);
      tasks.value[taskIndex].time = seconds.value;

      playingTask.value = task;
      seconds.value = task.time;
      play.value = true;
    }
  }
};

const handleOpenFloatingTimer = async (task: Task) => {
  await invoke("open_floating_timer", {
    taskId: task.id,
    time: task.time,
    isPlaying: play.value,
  });
  play.value = false;
  isFloatingTimerOpen.value = true;
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
    saveTasks();
    stopTracking();
  }
});

listen<FloatingTimerPayload>("close-floating-timer", async () => {
  await getTasks();
  isFloatingTimerOpen.value = false;
});

onMounted(async () => {
  await getTasks();
});

onUnmounted(() => {
  clearInterval(timerId);
  stopTracking();
});
</script>

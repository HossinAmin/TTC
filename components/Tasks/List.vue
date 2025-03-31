<template>
  <div class="flex flex-col gap-4">
    <TasksCard
      v-if="tasks?.length"
      v-for="task in tasks"
      v-bind="task"
      :time="play && playingTaskId === task.id ? seconds : task.time"
      :is-playing="play && playingTaskId === task.id"
      :hide-time="isFloatingTimerOpen && playingTaskId === task.id"
      @toggle-timer="handlePlay(task)"
      @open-floating-timer="handleOpenFloatingTimer()"
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

// sync tasks in DB every 30 seconds and on timer pause
let timerId: NodeJS.Timeout;

const isFloatingTimerOpen = ref(false);
const playingTaskId = ref<string>();

const { play, seconds } = useTimer();
const { tasks, getTasks, updateTaskTime } = useTasks(props.projectId);
const { startTracking, stopTracking } = useActivityTracker();

const syncTaskTime = async (seconds: number, taskId?: string) => {
  if (!taskId) return;
  const taskIndex = tasks.value?.findIndex((item) => item.id === taskId) ?? -1;

  if (!tasks.value?.[taskIndex]) return;

  tasks.value[taskIndex].time = seconds;
  await updateTaskTime(tasks.value[taskIndex].id, seconds);
};

const handlePlay = async (task: Task) => {
  // when: no playing task then play must be false
  //* then: start tracking,load seconds, turn play on, select playing task

  // when: clicks again on playing task
  //* then: stop tracking, turn play off, syncTimer

  // when: clicking on a task while another one is playing
  //* then: syncTimer, load seconds, select playing task

  if (!playingTaskId.value) {
    startTracking(stopTimer);

    timerId = setInterval(() => {
      // persist time every 30 seconds
      syncTaskTime(seconds.value, playingTaskId.value);
    }, 30 * 1000);

    playingTaskId.value = task.id;
    seconds.value = task.time;
    play.value = true;
  } else if (playingTaskId.value === task.id) {
    stopTimer();
    play.value = false;
    playingTaskId.value = undefined;
    syncTaskTime(seconds.value, task.id);
  } else {
    syncTaskTime(seconds.value, playingTaskId.value);
    playingTaskId.value = task.id;
    seconds.value = task.time;
    play.value = true;
  }
};

const stopTimer = () => {
  stopTracking();
  clearInterval(timerId);
  play.value = false;
  playingTaskId.value = undefined;
};

const handleOpenFloatingTimer = async () => {
  isFloatingTimerOpen.value = true;
  play.value = false;
  await invoke("open_floating_timer", {
    taskId: playingTaskId.value,
    seconds: seconds.value,
    isPlaying: true,
  });
};

listen<FloatingTimerPayload>("sync-timer", async (event) => {
  await syncTaskTime(event.payload.seconds, event.payload.taskId);
  await getTasks();
});

listen<FloatingTimerPayload>("close-floating-timer", async (event) => {
  isFloatingTimerOpen.value = false;

  playingTaskId.value = event.payload.isPlaying
    ? event.payload.taskId
    : undefined;
  seconds.value = event.payload.seconds;
  play.value = event.payload.isPlaying;

  await syncTaskTime(event.payload.seconds, event.payload.taskId);
  await getTasks();
});

onMounted(async () => {
  await getTasks();
});

onUnmounted(() => {
  clearInterval(timerId);
  stopTracking();
});
</script>

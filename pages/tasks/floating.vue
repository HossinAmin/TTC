<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center border border-solid border-border"
  >
    <p
      class="flex w-full grow select-none items-center justify-center text-[3rem]"
      @mousedown="invoke('start_window_drag')"
    >
      {{ timer.hours }}:{{ timer.minutes }}:{{ timer.seconds }}
    </p>
    <div class="flex w-full items-center justify-between bg-surface px-2 py-1">
      <Icon
        class="text-text hover:text-text-light active:text-text-lighter"
        name="fluent:picture-in-picture-exit-20-filled"
        :size="24"
        @click="closeFloatingTimer"
      />
      <Icon
        class="text-text hover:text-text-light active:text-text-lighter"
        :size="32"
        :name="!play ? 'ic:round-play-arrow' : 'ic:round-pause'"
        @click="toggleTimer"
      />
      <span class="w-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { FloatingTimerPayload } from "~/types/Time";
import type { Task } from "~/types/Tasks";

definePageMeta({
  layout: false,
});

const task = ref<Task>();
const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

const nuxtApp = useNuxtApp();
const { seconds, time, play } = useTimer();

const { isActive, startTracking, stopTracking } = useActivityTracker();
const toggleTimer = () => {
  play.value = !play.value;
};

const closeFloatingTimer = () => {
  getCurrentWindow().close();
};

const getTask = async (taskId: string): Promise<Task | undefined> => {
  const results = await nuxtApp.$db.select<Task[]>(
    "SELECT * FROM Tasks WHERE id = $1",
    [taskId],
  );

  return results?.[0];
};

const updateTaskTime = async (id: string, time: number) => {
  await nuxtApp.$db.execute("UPDATE Tasks SET time = $2 WHERE id = $1", [
    id,
    time,
  ]);
};

listen<FloatingTimerPayload>("open-floating-timer", async (event) => {
  task.value = await getTask(event.payload.taskId);
  seconds.value = task.value?.time ?? 0;
  play.value = event.payload.isPlaying;
});

//FIXME: remove all instances of `task.value?.id ?? ""`

listen<FloatingTimerPayload>("close-floating-timer", async (event) => {
  play.value = false;
  await updateTaskTime(task.value?.id ?? "", seconds.value);
});

let timerId: NodeJS.Timeout;
watch(play, () => {
  if (!play.value) {
    clearInterval(timerId);
    updateTaskTime(task.value?.id ?? "", seconds.value);
    stopTracking();
  } else {
    startTracking();
    timerId = setInterval(() => {
      updateTaskTime(task.value?.id ?? "", seconds.value);
    }, 30000);
  }
});

watchEffect(() => {
  if (isActive.value) {
    play.value = false;
  }
});
</script>

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

definePageMeta({
  layout: false,
});

const taskId = ref<string>();
const { seconds, time, play } = useTimer();

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

const toggleTimer = () => {
  play.value = !play.value;
};

let timerId: NodeJS.Timeout;
watch(play, () => {
  if (play.value) {
    timerId = setInterval(() => {
      invoke("sync_timer", {
        taskId: taskId.value,
        seconds: seconds.value,
        isPlaying: play.value,
      });
    }, 1000 * 30);
  } else {
    clearInterval(timerId);
  }
});

const closeFloatingTimer = async () => {
  await invoke("close_floating_timer", {
    taskId: taskId.value,
    seconds: seconds.value,
    isPlaying: play.value,
  });
  play.value = false;
  getCurrentWindow().close();
};

listen<FloatingTimerPayload>("open-floating-timer", async (event) => {
  console.log("open");

  taskId.value = event.payload.taskId;
  seconds.value = event.payload.seconds;
  play.value = event.payload.isPlaying;
});
</script>

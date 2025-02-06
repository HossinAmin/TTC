<template>
  <div
    class="flex w-full flex-col gap-4 rounded-lg border border-solid border-border bg-surface p-4"
  >
    <div class="flex items-center justify-between">
      <p>{{ task.name }}</p>
      <div class="flex gap-2">
        <Icon
          v-if="play"
          class="cursor-pointer text-xl active:text-text-lighter"
          name="fluent:picture-in-picture-enter-20-filled"
          :size="24"
          @click="$emit('openFloatingTimer')"
        />

        <Icon
          class="cursor-pointer text-xl active:text-text-lighter"
          name="ic:round-mode-edit-outline"
          :size="24"
          @click="$emit('edit')"
        />
        <Icon
          class="cursor-pointer text-xl active:text-text-lighter"
          name="ic:round-delete-forever"
          :size="24"
          @click="$emit('delete')"
        />
      </div>
    </div>

    <p>{{ task.description }}</p>

    <div v-show="!hideTime" class="flex items-center justify-end gap-4">
      <p class="text-xl">
        {{ timer.hours }}:{{ timer.minutes }}:{{ timer.seconds }}
      </p>
      <button
        class="flex items-center justify-center rounded-lg bg-white text-center hover:bg-slate-100 active:bg-slate-200"
        @click="toggleTimer"
      >
        <Icon
          class="text-primary hover:text-primary-dark active:text-primary-light"
          :size="32"
          :name="!play ? 'ic:round-play-arrow' : 'ic:round-pause'"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTasks from "~/composables/useTasks";
import type { Task } from "~/types/Tasks";

const emit = defineEmits<{
  edit: [];
  delete: [];
  play: [];
  openFloatingTimer: [];
}>();

const props = defineProps<{
  task: Task;
  playingTaskId?: string;
  hideTime?: boolean;
}>();

const { seconds, time, play, pad } = useTimer(props.task.time);
const { updateTaskTime } = useTasks(props.task.project);
const { isActive, startTracking, stopTracking } = useActivityTracker();

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

const toggleTimer = () => {
  play.value = !play.value;
  emit("play");
};

watch(
  [() => props.playingTaskId, () => props.hideTime, isActive],
  ([newPlayingTaskId, newHideTime, newIsActive]) => {
    if (
      (newPlayingTaskId !== props.task.id && play.value) ||
      newHideTime ||
      !newIsActive
    ) {
      play.value = false;
    }
  },
);

// i think these be housed up the tree
let timerId: NodeJS.Timeout;
// sync time in DB
watch(play, () => {
  if (!play.value) {
    clearInterval(timerId);
    updateTaskTime(props.task.id, seconds.value);
    stopTracking();
  } else {
    startTracking();
    timerId = setInterval(() => {
      updateTaskTime(props.task.id, seconds.value);
    }, 30000);
  }
});

onUnmounted(() => {
  clearInterval(timerId);
  stopTracking();
});
</script>

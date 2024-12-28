<template>
  <div class="flex w-full flex-col gap-4 rounded-lg bg-surface p-4">
    <div class="flex items-center justify-between">
      <p>{{ task.name }}</p>
      <div class="flex gap-2">
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-mode-edit-outline"
          :size="24"
          @click="$emit('edit')"
        />
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-delete-forever"
          :size="24"
          @click="$emit('delete')"
        />
      </div>
    </div>

    <p>{{ task.description }}</p>

    <div class="flex items-center justify-end gap-4">
      <p class="text-xl">
        {{ timer.hours }}:{{ timer.minutes }}:{{ timer.seconds }}
      </p>
      <button
        class="flex items-center justify-center rounded-lg bg-white text-center hover:bg-slate-100 active:bg-slate-200"
        @click="
          play = !play;
          $emit('play', task.id);
        "
      >
        <Icon
          class="text-primary-500 hover:text-primary-600 active:text-primary-400"
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

defineEmits<{
  edit: [];
  delete: [];
  play: [id: string];
}>();

const props = defineProps<{
  task: Task;
  playingTaskId?: string;
}>();

const { seconds, time, play, pad } = useTimer(props.task.time);

const { updateTaskTime } = useTasks(props.task.project);

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

// pause the task if another one starts playing
watch(
  () => props.playingTaskId,
  () => {
    if (props.playingTaskId !== props.task.id && play.value) {
      play.value = false;
    }
  },
);

let timerId: NodeJS.Timeout;
const { isActive, startTracking, stopTracking } = useActivityTracker();
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

watchEffect(() => {
  if (!isActive.value) {
    console.log("inactive");
    play.value = false;
  }
});

onUnmounted(() => {
  clearInterval(timerId);
  stopTracking();
});
</script>

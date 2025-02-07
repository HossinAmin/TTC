<template>
  <div
    class="flex w-full flex-col gap-4 rounded-lg border border-solid border-border bg-surface p-4"
  >
    <div class="flex items-center justify-between">
      <p>{{ name }}</p>
      <div class="flex gap-2">
        <Icon
          v-if="isPlaying"
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

    <p>{{ description }}</p>

    <div v-show="!hideTime" class="flex items-center justify-end gap-4">
      <p class="text-xl">
        {{ timer.hours }}:{{ timer.minutes }}:{{ timer.seconds }}
      </p>
      <button
        class="flex items-center justify-center rounded-lg bg-white text-center hover:bg-slate-100 active:bg-slate-200"
        @click="$emit('toggleTimer')"
      >
        <Icon
          class="text-primary hover:text-primary-dark active:text-primary-light"
          :size="32"
          :name="!isPlaying ? 'ic:round-play-arrow' : 'ic:round-pause'"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  edit: [];
  delete: [];
  toggleTimer: [];
  openFloatingTimer: [];
}>();

const props = defineProps<{
  name: string;
  time: number;
  description?: string | null;
  isPlaying?: boolean;
  hideTime?: boolean;
}>();

const timer = computed(() => {
  const timeObj = sec2TimeObj(props.time);
  return {
    hours: pad(timeObj.h),
    minutes: pad(timeObj.m),
    seconds: pad(timeObj.s),
  };
});
</script>

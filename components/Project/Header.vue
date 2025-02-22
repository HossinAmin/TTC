<template>
  <nav
    class="grid w-full grid-cols-[minmax(0,5fr),auto] items-end justify-between"
  >
    <div class="flex flex-col gap-2">
      <h1 class="truncate text-ellipsis text-4xl">
        {{ project?.name }}
      </h1>
      <p class="truncate text-ellipsis text-lg text-text-light">
        {{ project?.description }}
      </p>
    </div>

    <p class="text-end text-xl">
      {{ timer?.hours }}:{{ timer?.minutes }}:{{ timer?.seconds }}
    </p>
  </nav>
</template>

<script setup lang="ts">
import type { Project } from "~/types/Project";

const props = defineProps<{ project?: Project }>();

const timer = computed(() => {
  const time = sec2TimeObj(props.project?.time ?? 0);
  return {
    hours: pad(time.h),
    minutes: pad(time.m),
    seconds: pad(time.s),
  };
});
</script>

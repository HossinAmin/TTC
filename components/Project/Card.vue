<template>
  <div class="flex flex-col gap-2 border-b border-solid border-footer p-3">
    <div class="flex justify-between">
      <p class="text-lg font-semibold">{{ project.name }}</p>
      <div class="flex gap-4">
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-mode-edit-outline"
          :size="24"
          @click.stop="$emit('edit', project.id)"
        />
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-delete"
          :size="24"
          @click="$emit('delete', project.id)"
        />
      </div>
    </div>

    <NuxtLink
      class="flex grow flex-col justify-between"
      :to="{
        path: `/projects/${project.id}`,
      }"
    >
      <p class="text-sub">
        {{ project.description }}
      </p>

      <div class="flex justify-between">
        <p># tasks {{ project.tasks_count }}</p>
        <p>time {{ timer.hours }}:{{ timer.minutes }}:{{ timer.seconds }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/Project";

defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

const props = defineProps<{
  project: Project;
}>();

const { time, pad } = useTimer(props.project.time);

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));
</script>

<template>
  <NuxtLink
    class="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-text/20"
    :class="{
      'text-primary': selected,
    }"
    :to="{
      path: `/projects/${project.id}`,
    }"
  >
    <div class="flex items-center gap-3">
      <Icon
        :name="
          selected
            ? 'material-symbols:folder-open-rounded'
            : 'material-symbols:folder-rounded'
        "
        :size="32"
      />
      <div class="flex flex-col">
        <p>{{ project.name }}</p>

        <!-- truncate this -->
        <p class="text-xs text-text-lighter">{{ project.description }}</p>
      </div>
    </div>
    <p
      class="flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-text/20 text-xs text-text"
    >
      {{ project.tasks_count }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Project } from "~/types/Project";

defineProps<{
  project: Project;
  selected?: boolean;
}>();
</script>

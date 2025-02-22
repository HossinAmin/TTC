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
    <div class="flex flex-1 items-center gap-3 overflow-hidden">
      <Icon
        class="min-h-8 min-w-8"
        size="32px"
        :name="
          selected
            ? 'material-symbols:folder-open-rounded'
            : 'material-symbols:folder-rounded'
        "
      />
      <div class="flex flex-col overflow-hidden">
        <p class="truncate text-ellipsis">{{ project.name }}</p>
        <p class="truncate text-ellipsis text-xs text-text-lighter">
          {{ project.description }}
        </p>
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

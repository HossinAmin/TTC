<template>
  <div class="card-shadow flex h-40 flex-col gap-2 rounded-2xl bg-surface p-3">
    <div class="flex justify-between">
      <p class="text-lg font-semibold">{{ project.name }}</p>
      <div class="flex gap-4">
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-mode-edit-outline"
          @click.stop="$emit('edit', project.id)"
        />
        <Icon
          class="cursor-pointer text-xl active:text-footer"
          name="ic:round-delete-forever"
          @click="$emit('delete', project.id)"
        />
      </div>
    </div>

    <NuxtLink class="flex grow flex-col justify-between" to="/projects/[id]">
      <p class="text-sub">
        {{ project.description }}
      </p>

      <div class="flex justify-between">
        <p># tasks 5</p>
        <p>time 00:00:00</p>
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

defineProps<{
  project: Project;
}>();
</script>

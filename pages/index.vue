<template>
  <div class="flex w-full flex-col items-center justify-center gap-4 px-5">
    <template v-if="projects?.length === 0">
      <Icon name="solar:alarm-add-bold" :size="180" />
      <p class="max-w-[420px] text-center text-3xl font-bold">
        No project currently created yet. Please create a project
      </p>
    </template>
    <template v-else>
      <Icon name="qlementine-icons:mouse-selection-16" :size="180" />
      <p class="max-w-[420px] text-center text-3xl font-bold">Open a project</p>
    </template>
  </div>
</template>

<script setup lang="ts">
/*
// if you have projects select a project to see ?
// if there is no projects create yet show no project indicator
*/
const { projects } = useProjects();
</script>

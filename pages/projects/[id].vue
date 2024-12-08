<template>
  <div class="flex flex-col items-center justify-center gap-10 p-5">
    <div class="text-center">
      <div class="flex items-center justify-center gap-4">
        <h1 class="text-4xl">{{ project?.name }}</h1>
        <Icon
          v-if="project?.link"
          class="-rotate-45 cursor-pointer bg-primary-400"
          name="ic:round-link"
          :size="32"
          @click="open(project.link)"
        />
      </div>

      <p class="text-lg text-sub">{{ project?.description }}</p>

      <p class="text-4xl">
        {{ timer?.hours }}:{{ timer?.minutes }}:{{ timer?.seconds }}
      </p>
    </div>

    <template v-if="tasks">
      <TasksCard v-if="tasks.length !== 0" v-for="task in tasks" :task />
      <CommonEmptyIndicator v-else item-name="Tasks" />
    </template>
    <p v-else>Loading ...</p>
  </div>

  <button
    class="fixed bottom-10 end-10 flex items-center justify-center rounded-full border border-solid border-black bg-primary-500 p-3 font-bold shadow-2xl"
    @click="createTask('Task 1')"
  >
    <Icon class="text-4xl font-bold" name="ic:round-plus" />
  </button>
</template>

<script setup lang="ts">
import useTasks from "~/composables/useTasks";
import { open } from "@tauri-apps/plugin-shell";
import type { Project } from "~/types/Project";

const project = ref<Project>();

const route = useRoute();

const { getProject } = useProjects();

const { tasks, totalTime, getTasks, createTask } = useTasks(
  route.params.id as string,
);

const { seconds, time, pad } = useTimer(totalTime.value);

const timer = computed(() => ({
  hours: pad(time.value.h),
  minutes: pad(time.value.m),
  seconds: pad(time.value.s),
}));

onMounted(async () => {
  project.value = await getProject(route.params.id as string);
  await getTasks();
  seconds.value = totalTime.value;
});
</script>

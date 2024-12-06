<template>
  <div class="flex flex-col gap-20 px-14 py-16">
    <h1 class="text-center text-3xl font-bold">Total time 00:00:00</h1>

    <!-- project list -->
    <div
      v-if="projects"
      v-for="project in projects"
      class="flex flex-col gap-4"
    >
      <ProjectCard :project @edit="editProject" @delete="handleDelete" />
    </div>
    <p v-else>loading...</p>

    <button
      class="fixed bottom-3 end-3 flex items-center justify-center rounded-full border border-solid border-black bg-primary-500 p-2 shadow-2xl"
      @click="isProjectModalOpen = true"
    >
      <Icon class="text-2xl font-bold" name="ic:round-plus" />
    </button>
  </div>

  <ProjectModal
    v-model:is-open="isProjectModalOpen"
    :project="selectedProject"
    @close="handleClose"
  />

  <CommonConfirmModal
    v-model:is-open="isConfirmModalOpen"
    action="delete this project"
    @ok="confirmProjectDelete"
    @cancel="handleClose"
  />
</template>

<script setup lang="ts">
import ProjectModal from "~/components/Project/Modal.vue";
import useProjects from "~/composables/useProjects";
import type { Project } from "~/types/Project";

const isProjectModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedProject = ref<Project>();

const { projects, getProjects, deleteProject } = useProjects();

const editProject = (projectId: string) => {
  // open modal with data filled
  selectedProject.value = projects.value?.find((item) => item.id === projectId);
  isProjectModalOpen.value = true;
};

const handleDelete = (projectId: string) => {
  selectedProject.value = projects.value?.find((item) => item.id === projectId);
  isConfirmModalOpen.value = true;
};

const confirmProjectDelete = () => {
  if (selectedProject.value?.id) {
    deleteProject(selectedProject.value.id);
    handleClose();
  } else {
    throw new Error("No project is selected");
  }
};

const handleClose = () => {
  isConfirmModalOpen.value = false;
  isProjectModalOpen.value = false;
  selectedProject.value = undefined;
};

getProjects();
</script>

<style>
.card-shadow {
  box-shadow: 0 10px 40px -12px rgba(16, 24, 40, 0.2);
}
</style>

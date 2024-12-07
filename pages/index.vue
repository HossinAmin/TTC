<template>
  <div class="flex min-h-screen flex-col gap-20 px-14 py-16">
    <h1 class="text-center text-3xl font-bold">Total time 00:00:00</h1>

    <!-- project list -->
    <div v-if="projects" class="flex flex-grow flex-col gap-4">
      <ProjectCard
        v-if="projects.length !== 0"
        v-for="project in projects"
        :project
        @edit="editProject"
        @delete="handleDelete"
      />
      <CommonEmptyIndicator v-else item-name="project" />
    </div>
    <p v-else>loading...</p>

    <button
      class="fixed bottom-10 end-10 flex items-center justify-center rounded-full border border-solid border-black bg-primary-500 p-3 font-bold shadow-2xl"
      @click="isProjectModalOpen = true"
    >
      <Icon class="text-4xl font-bold" name="ic:round-plus" />
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

const { projects, getProjects, getProject, deleteProject } = useProjects();

const editProject = (projectId: string) => {
  selectedProject.value = getProject(projectId);
  isProjectModalOpen.value = true;
};

const handleDelete = (projectId: string) => {
  selectedProject.value = getProject(projectId);
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

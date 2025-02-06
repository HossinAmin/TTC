<template>
  <div class="flex min-h-screen flex-col">
    <nav class="flex items-center justify-between bg-surface p-2">
      <button class="flex" @click="isDrawerOpen = !isDrawerOpen">
        <Icon name="ic:round-menu" :size="32" />
      </button>

      <div class="flex items-center gap-2">
        <Icon
          v-if="currentProject?.link"
          class="-rotate-45 cursor-pointer bg-primary"
          name="ic:round-link"
          :size="32"
          @click="open(currentProject.link)"
        />

        <CommonDropdown
          icon-name="tabler:dots"
          :options="[
            {
              label: 'edit',
              value: 'EDIT',
              icon: 'ic:round-edit',
            },
            {
              label: 'delete',
              value: 'DELETE',
              icon: 'ic:round-delete-forever',
            },
          ]"
          @select="handleSelect"
        />
      </div>
    </nav>

    <main class="flex flex-1">
      <SideBar v-model:is-open="isDrawerOpen">
        <div class="flex flex-grow flex-col justify-between">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <h1 class="px-3 text-xl font-semibold">Projects</h1>
              <button class="flex self-end p-2">
                <Icon
                  name="ic:round-close"
                  :size="32"
                  @click="isDrawerOpen = false"
                />
              </button>
            </div>
            <ProjectCard
              v-if="projects?.length"
              v-for="project in projects"
              :project
              :selected="currentProject?.id === project.id"
            />
          </div>

          <button
            class="m-4 flex items-center justify-center rounded-lg bg-primary py-2 font-bold shadow-2xl"
            @click="
              isProjectModalOpen = true;
              currentProject = undefined;
            "
          >
            <p>Create Project</p>
            <Icon class="font-bold" name="ic:round-plus" :size="32" />
          </button>
        </div>
      </SideBar>

      <slot />
    </main>

    <ProjectModal
      v-model:is-open="isProjectModalOpen"
      :project="currentProject"
      @close="isProjectModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { open } from "@tauri-apps/plugin-shell";
import SideBar from "~/components/common/SideBar.vue";

const isDrawerOpen = ref(false);
const isProjectModalOpen = ref(false);

const router = useRouter();
const route = useRoute();
const { projects, currentProject, getProjects, getProject, deleteProject } =
  useProjects();
const { show } = useConfModal();

const handleSelect = (value: string) => {
  if (value === "EDIT") {
    isProjectModalOpen.value = true;
  } else if (value === "DELETE") {
    show("delete this project", confirmProjectDelete);
  }
};

const handleClose = () => {
  isProjectModalOpen.value = false;
  currentProject.value = undefined;
};

const confirmProjectDelete = () => {
  if (currentProject.value?.id) {
    deleteProject(currentProject.value.id);
    handleClose();
    router.replace("/projects");
  } else {
    throw new Error("No project is selected");
  }
};

getProjects();

watch([route, projects], async () => {
  currentProject.value = await getProject(route.params.id as string);
});
</script>

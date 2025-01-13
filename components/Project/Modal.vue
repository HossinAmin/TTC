<template>
  <CommonModal v-model:is-open="isOpen">
    <form class="flex flex-col gap-2" @submit.prevent="handelSubmit">
      <div class="flex flex-col">
        <label>Project Name <span class="text-error">*</span></label>
        <input name="name" type="text" required :value="project?.name" />
      </div>

      <div class="flex flex-col">
        <label>Description</label>
        <textarea name="description" :value="project?.description" />
      </div>

      <div class="flex flex-col">
        <label>Link </label>
        <input name="link" type="text" :value="project?.link" />
      </div>

      <div class="flex w-full justify-between px-5 py-10">
        <button
          class="rounded-lg bg-error px-10 py-2"
          @click.prevent="closeModal"
        >
          Cancel
        </button>
        <button class="rounded-lg bg-primary px-10 py-2">
          {{ project ? "Edit" : "Create" }}
        </button>
      </div>
    </form>
  </CommonModal>
</template>

<script setup lang="ts">
import type { Project } from "~/types/Project";

const emits = defineEmits<{ (e: "close"): void }>();
const props = defineProps<{ project?: Project }>();

const isOpen = defineModel("isOpen", { default: false });

const { createProject, editProject } = useProjects();

const handelSubmit = async (e: Event) => {
  const data = Object.fromEntries(
    new FormData(e.target as HTMLFormElement).entries(),
  ) as {
    name: string;
    link?: string;
    description?: string;
  };

  console.log(data);

  if (props.project) {
    await editProject(props.project.id, data.name, data.description, data.link);
  } else {
    await createProject(data.name, data.description, data.link);
  }
  closeModal();
};

const closeModal = () => {
  emits("close");
  isOpen.value = false;
};
</script>

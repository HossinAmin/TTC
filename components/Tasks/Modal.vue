<template>
  <CommonModal v-model:is-open="isOpen">
    <form class="flex flex-col gap-2" @submit.prevent="handelSubmit">
      <div class="flex flex-col">
        <label>Task Name <span class="text-red-500">*</span></label>
        <input name="name" type="text" required :value="task?.name" />
      </div>

      <div class="flex flex-col">
        <label>Description</label>
        <textarea name="description" :value="task?.description" />
      </div>

      <div class="flex flex-col">
        <label>Link </label>
        <input name="link" type="text" :value="task?.link" />
      </div>

      <div class="flex w-full justify-between px-5 py-10">
        <button
          class="rounded-lg bg-red-500 px-10 py-2"
          @click.prevent="closeModal"
        >
          Cancel
        </button>
        <button class="rounded-lg bg-primary-500 px-10 py-2">Create</button>
      </div>
    </form>
  </CommonModal>
</template>

<script setup lang="ts">
import type { Task } from "~/types/Tasks";

const emits = defineEmits<{ (e: "close"): void }>();
const props = defineProps<{ task?: Task }>();

const isOpen = defineModel("isOpen", { default: false });
const route = useRoute();

const { createTask, updateTask } = useTasks(route.params.id as string);

const handelSubmit = async (e: Event) => {
  const data = Object.fromEntries(
    new FormData(e.target as HTMLFormElement).entries(),
  ) as {
    name: string;
    link?: string;
    description?: string;
  };

  console.log(data);

  if (props.task) {
    await updateTask(props.task.id, data.name, data.description, data.link);
  } else {
    await createTask(data.name, data.description, data.link);
  }
  closeModal();
};

const closeModal = () => {
  emits("close");
  isOpen.value = false;
};
</script>

<template>
  <CommonModal v-model:is-open="isOpen">
    <form class="flex flex-col gap-2" @submit.prevent="handelSubmit">
      <div class="flex flex-col">
        <label>Project Name:</label>
        <input name="name" type="text" required />
      </div>

      <div class="flex flex-col">
        <label>Description:</label>
        <textarea name="description" />
      </div>

      <div class="flex w-full justify-between px-5 py-10">
        <button
          class="rounded-lg bg-red-500 px-10 py-2"
          @click.prevent="closeModal"
        >
          cancel
        </button>
        <button class="rounded-lg bg-primary-500 px-10 py-2">create</button>
      </div>
    </form>
  </CommonModal>
</template>

<script setup lang="ts">
const isOpen = defineModel("isOpen", { default: false });

const { createProject } = useProjects();

const handelSubmit = async (e: Event) => {
  const data = Object.fromEntries(
    new FormData(e.target as HTMLFormElement).entries(),
  ) as {
    name: string;
    description?: string;
  };

  console.log(data);

  await createProject(data.name, data.description);

  closeModal();
};

const closeModal = () => (isOpen.value = false);
</script>

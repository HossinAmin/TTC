<template>
  <CommonModal v-model:is-open="modal.isOpen">
    <div class="flex flex-col items-center justify-center gap-5">
      <p class="py-5 text-2xl">
        Are you sure you want to {{ modal.message }} ?
      </p>

      <div class="flex w-full justify-between px-5 py-5">
        <button
          class="rounded-lg bg-error px-10 py-2 capitalize"
          @click="handleCancel"
        >
          cancel
        </button>
        <button
          class="rounded-lg bg-primary px-10 py-2 capitalize"
          @click="handleOk"
        >
          Okay
        </button>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import useConfModal from "~/composables/useConfModal";

const { modal } = useConfModal();

const handleOk = () => {
  modal.value.ok?.();
  modal.value.isOpen = false;
};

const handleCancel = () => {
  modal.value.cancel?.();
  modal.value.isOpen = false;
};
</script>

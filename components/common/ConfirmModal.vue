<template>
  <CommonModal v-model:is-open="isOpen">
    <div class="flex flex-col items-center justify-center gap-5">
      <p class="py-5 text-2xl">Are you sure you want to {{ action }} ?</p>

      <div class="flex w-full justify-between px-5 py-5">
        <button
          class="rounded-lg bg-error px-10 py-2 capitalize"
          @click="$emit('cancel')"
        >
          cancel
        </button>
        <button
          class="rounded-lg bg-primary px-10 py-2 capitalize"
          @click="$emit('ok')"
        >
          Okay
        </button>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
const isOpen = defineModel("isOpen", { default: false });
defineEmits(["ok", "cancel"]);
defineProps<{ action: string }>();
</script>

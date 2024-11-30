<template>
  <div
    v-if="isOpen"
    class="fixed top-0 flex h-full w-full items-center justify-center bg-surface/80"
  >
    <div
      class="min-w-[50%] rounded-xl border border-solid border-footer bg-surface p-5"
    >
      <div class="flex justify-end">
        <Icon
          class="h-7 w-7 cursor-pointer active:text-footer"
          name="ic:round-close"
          @click="isOpen = false"
        />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = defineModel("isOpen", { default: false });
</script>

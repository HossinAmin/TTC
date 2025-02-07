<template>
  <div
    v-if="isOpen"
    class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-surface/80"
  >
    <div
      class="min-w-[50%] rounded-xl border border-solid border-border bg-surface p-5"
    >
      <div class="flex justify-end">
        <Icon
          class="h-7 w-7 cursor-pointer active:text-text-light"
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

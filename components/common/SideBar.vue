<template>
  <Transition name="drawer">
    <div
      v-if="isOpen"
      class="flex min-h-[100%] min-w-[50%] flex-col bg-surface shadow-xl md:min-w-[30%]"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineEmits(["close"]);
const isOpen = defineModel("isOpen");
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 200ms ease-in-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>

<template>
  <div class="fixed left-0 top-0 m-4 flex flex-col gap-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        class="flex min-w-96 flex-col gap-2 rounded-lg bg-surface p-3"
        :key="toast.id"
      >
        <div v-if="toast?.title" class="flex items-center gap-2">
          <Icon name="ic:outline-info" :size="24" />
          <p>{{ toast.title }}</p>
        </div>
        <p class="text-sm text-text-light">
          {{ toast?.description }}
        </p>

        <button
          v-if="!toast?.timeout"
          class="w-fit self-end rounded bg-primary px-2 py-1 text-xs"
          @click="removeToast(toast.id)"
        >
          okay
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import useToast from "~/composables/useToast";

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-leave-active {
  position: absolute;
}
</style>

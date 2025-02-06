<template>
  <NuxtLayout>
    <NuxtPage
      :transition="{
        name: 'page',
        mode: 'out-in',
      }"
    />
  </NuxtLayout>
  <ToastsTray />
  <CommonConfirmModal />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { toasts } = useToast();

watch(toasts, () => {
  if (toasts.value.length === 0) {
    nuxtApp.$resetTrayIcon();
  } else {
    nuxtApp.$setTrayIconNotify();
  }
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 150ms ease-in-out;
}

.page-enter-from {
  opacity: 0;
}

.page-leave-to {
  opacity: 0;
}
</style>

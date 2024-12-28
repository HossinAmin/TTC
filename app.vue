<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ToastsTray />
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

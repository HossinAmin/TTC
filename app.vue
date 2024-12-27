<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { toasts } = useToast();

watch(toasts, () => {
  console.log(toasts.value.length);

  if (toasts.value.length === 0) {
    nuxtApp.$resetTrayIcon();
  } else {
    nuxtApp.$setTrayIconNoti();
  }
});
</script>

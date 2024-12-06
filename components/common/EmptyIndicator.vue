<template>
  <div class="flex flex-col items-center justify-center gap-10">
    <img class="aspect-square h-[280px]" src="/assets/icons/empty.svg" />
    <p class="text-lg font-semibold uppercase">{{ itemName }} list is empty</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ itemName: string }>();
</script>

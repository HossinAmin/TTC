<template>
  <div class="flex flex-col gap-20 bg-background px-14 py-16 text-main">
    <h1 class="text-center text-3xl font-bold">Total time 00:00:00</h1>

    <!-- project list -->
    <div v-for="i in 5" class="flex flex-col gap-4">
      <!-- project card -->
      <div class="card-shadow flex flex-col gap-2 rounded-2xl bg-surface p-3">
        <div class="flex justify-between">
          <p class="text-lg font-semibold">My first project</p>
          <button @click.stop="handleEdit">
            <Icon
              name="ic:round-mode-edit-outline"
              class="text-xl active:text-footer"
            />
          </button>
        </div>

        <NuxtLink to="/projects/[id]">
          <p class="text-sub">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
            doloribus quis illo recusandae dolores facilis eum quam fuga iusto?
            Accusantium ut aliquid possimus perferendis vel a voluptatibus
            voluptatum reprehenderit rem.
          </p>

          <div class="flex justify-between">
            <p># tasks 5</p>
            <p>time 00:00:00</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <button
      class="fixed bottom-3 end-3 flex items-center justify-center rounded-full border border-solid border-black bg-primary-500 p-2 shadow-2xl"
    >
      <Icon class="text-2xl font-bold" name="ic:round-plus" />
    </button>
  </div>
</template>

<script setup lang="ts">
const handleEdit = (event: Event) => {};
</script>

<style>
.card-shadow {
  box-shadow: 0 10px 40px -12px rgba(16, 24, 40, 0.2);
}
</style>

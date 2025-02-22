<template>
  <button class="relative w-full" ref="dropdown" @click="toggleDropdown">
    <p
      class="flex w-full items-center justify-between disabled:cursor-not-allowed disabled:bg-neutral-200"
    >
      <Icon v-if="iconName" class="flex" :name="iconName" :size="32" />

      <label v-if="label">{{ label }}</label>
    </p>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-if="isOpen"
        class="absolute -left-20 z-10 my-1 max-h-60 w-28 overflow-auto rounded-lg bg-surface shadow-lg"
      >
        <li
          v-for="option in options"
          class="item flex w-full cursor-pointer items-center gap-1 truncate px-4 py-2 hover:bg-background/40"
          @click.stop="selectOption(option.value)"
        >
          <Icon v-if="option?.icon" :name="option.icon" />
          <span>{{ option?.label ?? option.value }}</span>
        </li>
      </ul>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits<{
  select: [value: string];
}>();

defineProps<{
  label?: string;
  iconName?: string;
  options: {
    label?: string;
    value: string;
    icon?: string;
  }[];
}>();

const isOpen = ref(false);
const dropdown = useTemplateRef("dropdown");

onClickOutside(dropdown, () => (isOpen.value = false));

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value: string) => {
  emit("select", value);
  isOpen.value = false;
};
</script>

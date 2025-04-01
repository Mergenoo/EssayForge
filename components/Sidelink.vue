<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2 px-3 py-2 rounded-md transition"
    :class="{
      'bg-[#1a1a1a] text-emerald-400': isActive,
      'text-gray-300 hover:bg-[#1a1a1a] hover:text-white': !isActive,
    }"
  >
    <component :is="`i-${icon}`" class="w-4 h-4" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  to: String,
  icon: String,
  label: String,
});
const route = useRoute();
const props = defineProps(["to"]);
const isActive = computed(() => route.path === props.to);
</script>

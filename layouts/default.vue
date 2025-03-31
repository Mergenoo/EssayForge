<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Footer from "~/components/Footer.vue";

const route = useRoute();
const showNavbar = computed(() => route.path.startsWith("/home"));
</script>

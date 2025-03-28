<template>
  <div class="min-h-screen flex flex-col">
    <!-- Dynamic Navbar -->
    <component :is="showNavbar ? Navbar : LandingNavbar" />

    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import LandingNavbar from "~/components/LandingNavbar.vue";
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";

const route = useRoute();
const showNavbar = computed(() => route.path.startsWith("/essays"));
</script>

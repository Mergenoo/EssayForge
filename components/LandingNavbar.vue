<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <nav class="fixed top-0 left-0 z-50 w-full text-white p-4 bg-secondary">
    <div
      class="container mx-auto px-24 flex justify-between items-center w-full h-10"
    >
      <NuxtLink to="/">
        <img src="/images/logo.svg" alt="EssayForge Logo" />
      </NuxtLink>

      <div class="space-x-4">
        <NuxtLink
          to="/plans"
          class="relative px-4 py-2 rounded-md transition hover:text-hover"
          :class="
            route.path === '/plans'
              ? 'text-hover after:content-[\'\'] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-primary after:scale-x-100'
              : 'text-white'
          "
        >
          Plans
        </NuxtLink>

        <NuxtLink
          to="/signin"
          class="relative px-4 py-2 rounded-md transition hover:text-hover"
          :class="
            route.path === '/signin'
              ? 'text-hover after:content-[\'\'] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-primary after:scale-x-100'
              : 'text-white'
          "
        >
          Sign In
        </NuxtLink>

        <NuxtLink
          to="/get-started"
          class="px-4 py-2 rounded-md transition duration-300 transform"
          :class="
            route.path === '/get-started'
              ? 'bg-primary text-white shadow-lg shadow-primary/50 scale-105'
              : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/50 hover:scale-105'
          "
        >
          Get Started
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

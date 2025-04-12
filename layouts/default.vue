<template>
  <div class="h-screen flex flex-col bg-[#121212] text-white overflow-hidden">
    <!-- Fixed Navbar -->
    <div class="fixed top-0 left-0 w-full z-50">
      <Navbar />
    </div>

    <div class="flex flex-1 pt-16 overflow-hidden">
      <div v-if="isHomeRoute" class="w-64 verflow-y-auto h-full">
        <Sidebar />
      </div>

      <main class="flex-1 overflow-y-auto h-full">
        <slot />
      </main>
    </div>

    <div v-if="toggle">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import Sidebar from "~/components/Sidebar.vue";

const route = useRoute();
const toggle = ref(false);
const isHomeRoute = computed(() => route.path.startsWith("/home"));

const handleToggle = () => {
  const essayRoute = route.params.id;
  if (!essayRoute) toggle.value = !toggle.value;
};

onMounted(() => {
  handleToggle();
});
</script>

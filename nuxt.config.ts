export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-tiptap-editor", "nuxt-tiptap-editor"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  tiptap: {
    prefix: "Tiptap",
  },
  compatibilityDate: "2025-03-15",
});

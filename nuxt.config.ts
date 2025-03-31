export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-tiptap-editor",
    "nuxt-tiptap-editor",
    "@nuxtjs/supabase",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  tiptap: {
    prefix: "Tiptap",
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/signin",
      callback: "/home",
      include: ["/", "/signup"],
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  vite: {
    optimizeDeps: {
      include: ["cookie"],
    },
    ssr: {
      noExternal: ["cookie"],
    },
  },
  compatibilityDate: "2025-03-15",
});

import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-tiptap-editor",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
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
    plugins: [
      Icons({
        compiler: "vue3",
        autoInstall: true,
      }),
      Components({
        resolvers: [IconsResolver({ prefix: "i" })], // 👈 auto-import <i-lucide-* />
      }),
    ],
  },

  compatibilityDate: "2025-03-15",
});

declare module "#app" {
  interface NuxtApp {
    $supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>;
  }
}
export {};

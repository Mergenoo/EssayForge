// src/store/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { Database } from "~/types/supabase";

export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient<Database>();
  const router = useRouter();

  const email = ref("");
  const password = ref("");
  const username = ref("");
  const errorMessage = ref<string | null>(null);

  const handleSignIn = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = "All fields are required!";
      return;
    }

    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
      return;
    }
  };

  const handleSignUp = async () => {
    if (!username.value || !email.value || !password.value) {
      errorMessage.value = "All fields are required!";
      return;
    }

    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error?.message === "User already registered") {
      errorMessage.value = "This email is already in use.";
    }

    if (error) {
      errorMessage.value = error.message;
      return;
    }

    const { error: insertError } = await client.from("users").insert({
      username: username.value,
      email: email.value,
    });

    if (insertError) {
      errorMessage.value = insertError.message;
      return;
    }
  };

  return {
    username,
    email,
    password,
    errorMessage,
    handleSignIn,
    handleSignUp,
  };
});

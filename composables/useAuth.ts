import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "~/types/supabase";

export const useAuth = () => {
  const user = useState<User | null>("user", () => null);

  const supabase = useNuxtApp().$supabase as SupabaseClient<Database>;

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user.value = data.user;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  return {
    user,
    fetchUser,
    signIn,
    signUp,
    signOut,
  };
};

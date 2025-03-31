export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  const publicPages = ["/", "/signin", "/signup", " "];
  if (publicPages.includes(to.path)) return;

  if (user.value === undefined) return;

  if (!user.value) return navigateTo("/signin");
});

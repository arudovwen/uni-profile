export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Avoid infinite redirect to homepage if already on the homepage
  if (authStore.isLoggedIn && to?.name?.includes("auth")) {
    // Only redirect to homepage if the current route is not the homepage

    return navigateTo(`/`);
  }

  // Avoid infinite redirect to login if already on the login page
  if (!authStore.isLoggedIn && !to?.name?.includes("auth")) {
    // Only redirect to login if the current route is not the login page
    if (to.path !== "/auth/login") {
      abortNavigation(); // Stop the current navigation
      return navigateTo(
        `/auth/login?${new URLSearchParams({
          redirected_from: to.path,
          ...to.query,
        })}`
      );
    }
  }
});

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const mattaAuth = useCookie("mattaAuth");

  // Check if the user is authenticated
  const isAuthenticated = !!mattaAuth.value;

  // Handle authenticated user logic
  if (isAuthenticated) {
    // Redirect if the user is trying to access a route with a `continue` query parameter
    if (to.query.continue) {
      abortNavigation();
      handleRedirect(to, authStore.jwToken);
      return;
    }

    // Redirect non-superadmin users trying to access superadmin routes

    if (
      mattaAuth.value.userCategory !== 3 &&
      superadminRoutes.includes(to.name)
    ) {
      abortNavigation();
      return navigateTo("/");
    }

    // Redirect superadmin users trying to access non-superadmin routes
    if (
      mattaAuth.value.userCategory === 3 &&
      !superadminRoutes.includes(to.name) &&
      !univeralRoutes.includes(to.name)
    ) {
      abortNavigation();
      return navigateTo("/user-management");
    }

    // Redirect authenticated users away from auth-related routes
    if (to?.name?.includes("auth")) {
      return navigateTo("/");
    }
  }

  // Handle unauthenticated user logic
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page if they're not already there
    if (!to.path?.includes("auth") && !to.path?.includes("invited-user")) {
      abortNavigation();
  
      // Create the base URL for redirection
      let redirectUrl = `/auth/login${to.params.app ? `/${to.params.app}` : ""}`;
  
      // Prepare the query parameters
      const queryParams = new URLSearchParams(to.query);
  
      // Add redirected_from only if to.path is valid
      if (to.path) {
        queryParams.set("redirected_from", to.path);
      }
  
      // Append query parameters to the URL
      redirectUrl += `?${queryParams.toString()}`;
  
      return navigateTo(redirectUrl);
    }
  }
});

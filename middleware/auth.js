import { intialRoute } from "~/utils/constants";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const mattaAuth = useEncryptedCookie(AUTH_COOKIE_NAME, defaultOptions);

  // Check if the user is authenticated
  const isAuthenticated = !!mattaAuth.value;

  // Handle authenticated user logic
  if (isAuthenticated) {
    // Redirect if the user is trying to access a route with a `continue` query parameter
    if (to.query.continue) {
      abortNavigation();
      handleRedirect(to, { ...mattaAuth.value }, to.params.app);
      return;
    }

    // Redirect non-superadmin users trying to access superadmin routes

    // if (
    //   mattaAuth.value.userCategory !== 3 &&
    //   superadminRoutes.includes(to.name)
    // ) {
    //   abortNavigation();
    //   return navigateTo("/");
    // }

    // // Redirect superadmin users trying to access non-superadmin routes
    // if (
    //   mattaAuth.value.userCategory === 3 &&
    //   !superadminRoutes.includes(to.name) &&
    //   !univeralRoutes.includes(to.name)
    // ) {
    //   abortNavigation();
    //   return navigateTo("/user-management");
    // }

    // Redirect authenticated users away from auth-related routes
    if (to?.name?.includes("auth") || to.path?.includes("register")) {
      const redirectPath = intialRoute[mattaAuth.value.userCategory] || "/";
      return navigateTo(redirectPath);
    }
  }

  // Handle unauthenticated user logic
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page if they're not already there
    if (!to.path?.includes("auth") && !to.path?.includes("invited-user") && !to.path?.includes("register")) {
      abortNavigation();

      // Create the base URL for redirection
      let redirectUrl = `/auth/login${
        to.params.app ? `/${to.params.app}` : ""
      }`;

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

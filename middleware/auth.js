import { universalRoutes } from "~/utils/constants";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const mattaAuth = useEncryptedCookie("mattaAuth_Dev", defaultOptions);
console.log({mattaAuth});

  // Check if the user is authenticated
  const isAuthenticated = !!mattaAuth.value;
  const userCategory = mattaAuth.value?.userCategory ?? null;

  const routeName = to.name || ""; // avoid undefined issues

  // ---- ALWAYS ALLOW UNIVERSAL ROUTES ----
  if (universalRoutes.includes(routeName)) {
    return;
  }

  // ---- AUTHENTICATED USERS ----
  if (isAuthenticated) {

    // Prevent looping by avoiding redirect to the same route
    if (from.name === to.name) return;

    // Prevent authenticated users from visiting auth pages
    if (routeName.includes("auth")) {
      if (routeName !== "home") {
        return navigateTo("/");
      }
      return;
    }

    // Allowed route map per user type
    const access = {
      3: superadminRoutes,
      0: adminRoutes,
      4: adminRoutes,
      1: userRoutes,
      2: userRoutes,
    };

    const allowedRoutes = [
      ...access[userCategory] ?? [],
      ...universalRoutes
    ];
console.log({routeName, allowedRoutes});

    // Only block if route actually exists AND is not allowed
    if (routeName && !allowedRoutes.includes(routeName)) {
      // prevent superadmin loops
      if (userCategory === 3 && to.path !== "/user-management") {
        return navigateTo("/user-management");
      }

      // prevent home loop
      if (to.path !== "/") {
        return navigateTo("/");
      }
    }

    return;
  }

  // ---- UNAUTHENTICATED USERS ----
  const isAuthRoute = to.path.includes("auth");
  const isInvitedRoute = to.path.includes("invited-user");

  if (!isAuthRoute && !isInvitedRoute) {

    // Prevent redirect loop if already on login
    if (from.path === to.path) return;

    let loginUrl = `/auth/login${to.params.app ? `/${to.params.app}` : ""}`;

    const query = new URLSearchParams(to.query);

    // Avoid infinite redirects if already redirected
    if (!query.has("redirected_from")) {
      query.set("redirected_from", to.fullPath);
    }

    loginUrl += `?${query.toString()}`;
    return navigateTo(loginUrl);
  }
});

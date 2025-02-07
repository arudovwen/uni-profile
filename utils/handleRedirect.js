export function handleRedirect(route, token, app) {
  const authStore = useAuthStore();
  const url = authStore.appList?.find((i) => i.code === app)?.defaultUrl;
  return window.location.replace(
    `${url || route.query.continue}/auth/validate?token=${token}`
  );
}

export function handleAppRedirect(app) {
  return window.location.replace(`/auth/login${app ? `/${app}` : ""}`);
}

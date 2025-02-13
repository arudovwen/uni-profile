export function handleRedirect(route, { token, userCategory }, app) {
  const authStore = useAuthStore();
  const url = authStore.appList?.find((i) => i.code === app)?.defaultUrl;

  return window.location.replace(
    `${
      url.replace(
        "https://",
        [0, 3].includes(userCategory) ? "https://admin." : "https://"
      ) || route.query.continue
    }/auth/validate?token=${token}`
  );
}

export function handleAppRedirect(app) {
  return window.location.replace(`/auth/login${app ? `/${app}` : ""}`);
}

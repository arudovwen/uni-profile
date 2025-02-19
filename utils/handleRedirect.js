export function handleRedirect(route, { jwToken, userCategory }, app) {
  const authStore = useAuthStore();
  const url = authStore.appList?.find((i) => i.code === app)?.defaultUrl;

  return window.location.replace(
    `${
      url?.replace(
        "https://",
        [0, 3].includes(userCategory) ? "https://admin." : "https://"
      ) || route.query.continue
    }/auth/validate?token=${jwToken}`
  );
}

export function handleResetRedirect(userCategory, app) {
  const authStore = useAuthStore();
  const url = authStore.appList?.find((i) => i.code === app)?.defaultUrl;
  const gotoUrl = `${
    url?.replace(
      "https://",
      [0, 3].includes(parseInt(userCategory)) ? "https://admin." : "https://"
    ) || route.query.continue
  }/login`;
  // console.log("gotoUrl",gotoUrl)
  return window.location.replace(gotoUrl);
}
export function handleAppRedirect(app) {
  return window.location.replace(`/auth/login${app ? `/${app}` : ""}`);
}

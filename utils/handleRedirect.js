export function handleRedirect(route, token) {
  return window.location.replace(
    `${route.query.continue}/auth/validate?token=${token}`
  );
  return;
}

export function handleAppRedirect(app) {
  if (app) {
    const AppUrl = AppsObject[app]?.url;
    return window.location.replace(`/auth/login/${app}?continue=${AppUrl}`);
  }
  return window.location.replace(`/auth/login`);
}

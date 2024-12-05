export function getClientAppVersion() {
    return localStorage.getItem("APP_VERSION") ?? 0;
  }
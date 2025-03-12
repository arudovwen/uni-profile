export function handleRedirect(route, { jwToken, userCategory, refreshToken }, app) {
  const { encrypt } = useEncryption();
  const authStore = useAuthStore();
  
  let targetUrl = route.query.continue;
  
  if (app) {
    const appInfo = authStore.appList?.find(i => i.code === app);
    if (appInfo?.defaultUrl) {
      const isAdminUser = [0, 3].includes(userCategory);
      targetUrl = appInfo.defaultUrl.replace(
        "https://",
        isAdminUser ? "https://admin." : "https://"
      );
      
      // Handle the app.fluxafrica case
      if (targetUrl.includes("app.fluxafrica") && isAdminUser) {
        targetUrl = targetUrl.replace("app.", "");
      }
    }
  }
  
  if (!targetUrl) {
    console.error("No redirect URL found");
    return false; // Return false to indicate the redirect failed
  }
  
  const encryptedJWT = encrypt(jwToken);
  const encryptedRefresh = encrypt(refreshToken);
  const fullUrl = `${targetUrl}/auth/validate?token=${encodeURIComponent(encryptedJWT)}&code=${encodeURIComponent(encryptedRefresh)}`;
  
  return window.location.replace(fullUrl);
}

export function handleResetRedirect(userCategory, app) {
  const authStore = useAuthStore();
  const route = useRoute(); // Make sure this hook is imported
  
  let targetUrl = route.query.continue;
  
  if (app) {
    const appInfo = authStore.appList?.find(i => i.code === app);
    if (appInfo?.defaultUrl) {
      const isAdminUser = [0, 3].includes(parseInt(userCategory));
      targetUrl = appInfo.defaultUrl.replace(
        "https://",
        isAdminUser ? "https://admin." : "https://"                          
      );
      
      // Handle the app.fluxafrica case
      if (targetUrl.includes("app.fluxafrica") && isAdminUser) {
        targetUrl = targetUrl.replace("app.", "");
      }
    }
  }
  
  if (!targetUrl) {
    console.error("No redirect URL found");
    return false; // Return false to indicate the redirect failed
  }
  
  const fullUrl = `${targetUrl}/login`;
  
  // For debugging
  // console.log("gotoUrl", fullUrl);
  
  return window.location.replace(fullUrl);
}

export function handleAppRedirect(app) {
  return window.location.replace(`/auth/login${app ? `/${app}` : ""}`);
}

// Trusted domains for redirect validation
const ALLOWED_REDIRECT_DOMAINS = [
  "matta.trade",
  "fluxafrica.com",
  "oxidepro.com",
  "deltalog.co",
  "localhost",
];

/**
 * Check if a URL is safe to redirect to.
 * Only allows URLs on trusted domains.
 */
function isAllowedRedirectUrl(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED_REDIRECT_DOMAINS.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export function handleRedirect(
  route,
  { jwToken, userCategory, refreshToken },
  app
) {
  const { encrypt } = useEncryption();
  const authStore = useAuthStore();

  // Validate input parameters
  if (!route || !jwToken || !refreshToken) {
    console.error("Missing required parameters for redirect");
    return false;
  }

  let targetUrl = route.query.continue || null;

  // Validate the continue URL against the allowlist
  if (targetUrl && !isAllowedRedirectUrl(targetUrl)) {
    console.error("Redirect blocked: untrusted domain", targetUrl);
    targetUrl = null;
  }

  if (app && !targetUrl) {
    const appInfo = authStore.appList?.find((i) => i.code === app);
    if (appInfo?.defaultUrl) {
      const isAdminUser = [0, 3, 4].includes(userCategory);
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

  try {
    const encryptedJWT = encrypt(jwToken);
    const encryptedRefresh = encrypt(refreshToken);

    const fullUrl = new URL(targetUrl);
    
    // Save original path and search if it's not the root or already the validate endpoint
    if (fullUrl.pathname !== '/' && fullUrl.pathname !== '/auth/validate') {
      const originalPathAndSearch = fullUrl.pathname + fullUrl.search;
      fullUrl.searchParams.set("redirectUrl", originalPathAndSearch);
    }

    fullUrl.pathname = "/auth/validate";
    fullUrl.searchParams.set("token", encryptedJWT);
    fullUrl.searchParams.set("code", encryptedRefresh);

    window.location.replace(fullUrl.toString());
    return true;
  } catch (error) {
    console.error("Redirect failed:", error);
    return false;
  }
}

export function handleResetRedirect(userCategory, app) {
  const authStore = useAuthStore();
  const route = useRoute(); // Make sure this hook is imported

  let targetUrl = route.query.continue;

  if (app) {
    const appInfo = authStore.appList?.find((i) => i.code === app);
    if (appInfo?.defaultUrl) {
      const isAdminUser = [0, 3, 4].includes(parseInt(userCategory));
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

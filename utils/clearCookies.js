export async function clearCookies() {
  try {
    // Use CookieStore API if available (modern browsers)
    if (typeof cookieStore !== "undefined" && cookieStore?.getAll) {
      const cookies = await cookieStore.getAll();

      if (cookies.length > 0) {
        for (const cookie of cookies) {
          await cookieStore.delete(cookie.name, { path: cookie.path, domain: cookie.domain });
        }
      }
      return;
    }

    // Fallback: Clear cookies via document.cookie (broader browser support)
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const name = cookie.split("=")[0].trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.matta.trade`;
      }
    }
  } catch (error) {
    console.error("Error clearing cookies:", error);
  }
}
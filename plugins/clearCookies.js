import { defineNuxtPlugin } from "#app";
import { configure } from "vee-validate";

export async function clearCookies() {
  const cookies = await cookieStore.getAll();

  if (cookies.length > 0) {
    console.log("Deleting cookies:", cookies);

    // Delete each cookie
    for (const cookie of cookies) {
      await cookieStore.delete(cookie.name, {
        path: cookie.path,
        domain: cookie.domain,
      });
    }

    console.log("Cookies deleted successfully");
  } else {
    console.log("No cookies found");
  }
}

export default defineNuxtPlugin(() => {});

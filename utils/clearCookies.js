export async function clearCookies() {
    const cookies = await cookieStore.getAll();
  
    if (cookies.length > 0) {
    
      // Delete each cookie
      for (const cookie of cookies) {
        await cookieStore.delete(cookie.name, { path: cookie.path, domain: cookie.domain });
      }
  

    } else {
      console.log("No cookies found");
    }
  }
  
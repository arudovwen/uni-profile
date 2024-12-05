


export default defineNuxtPlugin((nuxtApp) => {
  try {
    nuxtApp.$router.afterEach((to, from) => {
      fetch("/version.json") // Adjust the path based on your project structure
        .then((serverPromise) =>
          serverPromise.json().then((response) => {
            const latestVersion = response.version;
            const clientStoredVersion = getClientAppVersion();
    
            if (clientStoredVersion != latestVersion) {
              clearCookies();
              localStorage.clear();
              setClientAppVersion(latestVersion);
              window.location.reload(true);
            } else {
              return;
            }
          })
        )
        .catch((error) => {
          // console.error('Error fetching version.json:', error);
        });
    });
  } catch (error) {
    console.error('Plugin error:', error);
  }
});

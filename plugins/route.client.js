

export default defineNuxtPlugin((nuxtApp) => {
  // Seed the stored version on page load so the first navigation does not
  // trigger a spurious reload when no version is stored in localStorage yet.
  const versionSyncPromise = fetch("/version.json")
    .then((res) => res.json())
    .then((response) => {
      if (response.version) {
        setClientAppVersion(response.version);
      }
    })
    .catch(() => {});

  try {
    nuxtApp.$router.afterEach((to, from) => {
      // Wait for the initial version sync before checking, so the first
      // navigation never sees a stale (unset) version and causes a reload.
      versionSyncPromise.then(() => {
        fetch("/version.json") // Adjust the path based on your project structure
          .then((serverPromise) =>
            serverPromise.json().then((response) => {
              const latestVersion = response.version;
              const clientStoredVersion = getClientAppVersion();

              if (clientStoredVersion != latestVersion) {
                clearCookies().finally(() => {
                  localStorage.clear();
                  setClientAppVersion(latestVersion);
                  window.location.reload(true);
                });
              }
            })
          )
          .catch((error) => {
            // console.error('Error fetching version.json:', error);
          });
      });
    });
  } catch (error) {
    console.error('Plugin error:', error);
  }
});

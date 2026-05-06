export function saveAuthProfile(obj) {
  const mattaProfiles = useEncryptedCookie(PROFILE_COOKIE_NAME, defaultOptions);
  const mattaAuth = useEncryptedCookie(AUTH_COOKIE_NAME, defaultOptions);
  mattaAuth.value = obj;
  mattaProfiles.value = mattaProfiles.value || [];
  const exists = mattaProfiles.value?.some(
    (existingObj) => existingObj?.jwToken === obj?.jwToken || existingObj?.email === obj?.email 
  );
  if (exists) {
    return;
  }
  mattaProfiles.value.push(obj);
}

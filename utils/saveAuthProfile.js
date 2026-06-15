export function saveAuthProfile(obj) {
  const mattaProfiles = useEncryptedCookie(PROFILE_COOKIE_NAME, defaultOptions);
  const mattaAuth = useEncryptedCookie(AUTH_COOKIE_NAME, defaultOptions);

  // Extract only essential fields to prevent cookie size limit (>4KB)
  const slimObj = {
    jwToken: obj?.jwToken,
    refreshToken: obj?.refreshToken,
    roles: obj?.roles,
    id: obj?.id,
    businessId: obj?.businessId,
    userCategory: obj?.userCategory,
    email: obj?.email,
    fullName: obj?.fullName,
  };

  mattaAuth.value = slimObj;
  mattaProfiles.value = mattaProfiles.value || [];
  
  const exists = mattaProfiles.value?.some(
    (existingObj) => existingObj?.jwToken === slimObj?.jwToken || existingObj?.email === slimObj?.email 
  );
  
  if (exists) {
    return;
  }
  
  mattaProfiles.value.push(slimObj);
}

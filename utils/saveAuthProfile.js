export function saveAuthProfile(obj) {
  const mattaProfiles = useEncryptedCookie("mattaProfiles_Dev",defaultOptions);
  const mattaAuth = useEncryptedCookie("mattaAuth_Dev", defaultOptions);
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

export function saveAuthProfile(obj) {
  const mattaProfiles = useCookie("mattaProfiles",defaultOptions);
  const mattaAuth = useCookie("mattaAuth", defaultOptions);
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

export function saveAuthProfile(obj) {
  const mattaProfiles = useCookie("mattaProfiles");
  const mattaAuth = useCookie("mattaAuth");
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

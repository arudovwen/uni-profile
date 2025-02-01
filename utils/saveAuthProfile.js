export function saveAuthProfile(obj) {
  const mattaProfiles = useCookie("mattaProfiles");
  mattaProfiles.value = mattaProfiles.value || [];
  const exists = mattaProfiles.value?.some(
    (existingObj) => existingObj?.jwToken === obj?.jwToken
  );
  if (exists) {
    return;
  }
  mattaProfiles.value.push(obj);
}

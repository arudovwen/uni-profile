<template><span class="hidden">loading</span></template>
<script setup>
onMounted(() => {
  window.addEventListener("message", (event) => {
    if (Object.values(AppsObject)?.every((i) => i.url !== event.origin)) {
      return;
    }
    const tempData = JSON.parse(event.data);
    useAuthStore().setLoggedUser(tempData);
  });
});
</script>

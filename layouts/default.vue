<template>
  <div
    class="bg-[#F9FAFB] darks:bg-gray-800 relative w-screen flex flex-col h-screen overflow-y-auto"
  >
    <div class="hidden lg:block">
      <AppHeader :showlang="true" />
    </div>
    <MobileHeader />
    <div class="fixed z-10">
      <LayoutMobileSideComponent />
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
<script setup>
const { name } = useRoute();
useHead({
  title: `${name !== "index" ? ucFirst(name) : "Account Management"}  | Matta`,
  meta: [
    {
      name: "description",
      content: "Account Management",
    },
  ],
});
const showSideBar = ref(false);

provide("showSideBar", showSideBar);
provide("toggleSideBar", (val) => {
  showSideBar.value = val;
});
</script>

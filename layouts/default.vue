<template>
  <div
    class="bg-[#F9FAFB] darks:bg-gray-800 relative w-screen flex flex-col h-screen overflow-y-auto"
  >
    <AppHeader :showlang="true" />
    <ProfileHeader />
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
</script>

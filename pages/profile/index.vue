<template>
  <NuxtLayout>
    <div class="py-10">
      <PagesProfileInformation />
      
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});
const route = useRoute();
</script>

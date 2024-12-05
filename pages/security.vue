<template>
  <NuxtLayout>
    <div class="py-10 grid gap-y-10">
      <PagesSecurityPassword /> 
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
</script>

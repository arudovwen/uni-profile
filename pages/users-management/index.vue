<template>
  <NuxtLayout>
    <div class="container py-10">
        <PagesUsers />
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
</script>

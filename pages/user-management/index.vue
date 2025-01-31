<template>
  <NuxtLayout>
    <div class="container">
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

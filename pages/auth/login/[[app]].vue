<template>
  <AuthLogin @close="() => {}" />
</template>

<script setup>
import { definePageMeta, useHead } from "#imports";
definePageMeta({
  layout: "auth",
  middleware: "auth"
});
useHead({
  title: "Login | Matta",
  meta: [{ name: "description", content: "Login | Matta" }],
});
</script>

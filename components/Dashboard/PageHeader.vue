<template>
  <div class="mb-5">
    <!-- Title and Subtitle -->
    <h1 class="text-xl font-semibold text-[#2F2F2F] leading-[28px]">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="text-sm text-[#475467]">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: "",
});
</script>

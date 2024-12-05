<!-- HtmlCell.vue -->
<template>
    <div v-html="row[column.key] ?? '-'" class="html-content whitespace-nowrap "></div>
  </template>
  
  <script setup>
  const props = defineProps({
    row: {
      type: Object,
      required: true,
    },
    column: {
      type: Object,
      required: true,
    },  statType: {}
  });
  </script>
  
  <style scoped>
  .html-content {
    /* Add any styling here specific to HTML cells */
    font-size: 0.875rem;
    color: #454745;
  }
  </style>
  
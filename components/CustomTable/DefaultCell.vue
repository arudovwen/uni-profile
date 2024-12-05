<!-- DefaultCell.vue -->
<template>
  <div class="text-sm text-[#454745] whitespace-nowrap ]">
    {{ row[column.key] ?? "-" }}
  </div>
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
/* You can add any specific styling here if needed */
</style>

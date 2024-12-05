<!-- StatusCell.vue -->
<template>
  
  <AppStatusButton :status="row.status" :stattype="statType" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
  statType: {}
});

// Determine the status value from the row based on the column key
</script>

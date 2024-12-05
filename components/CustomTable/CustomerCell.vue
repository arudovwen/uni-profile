<!-- CustomerCell.vue -->
<template>
  <div class="flex items-center">
    <img :src="row.photo" class="w-8 h-8 rounded-full mr-2" />
    <div>
      <p>{{ row.firstName }} {{ row.lastName }}</p>
      <small>{{ row.email }}</small>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  row: Object,
  column: Object,
  statType: {},
});
</script>

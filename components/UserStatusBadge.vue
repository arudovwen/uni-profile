<template>
  <div :class="['status-badge', badgeClass]">
    <span>{{ displayText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const displayText = computed(() => {
  if (!props.status) return '';
  const s = props.status.toLowerCase();
  if (s === 'active') return 'Active';
  if (s === 'pending' || s === 'pending invite') return 'Pending Invite';
  if (s === 'inactive') return 'Inactive';
  return props.status;
});

const badgeClass = computed(() => {
  const s = props.status ? props.status.toLowerCase() : '';
  if (s === 'active') return 'badge-active';
  if (s === 'pending' || s === 'pending invite') return 'badge-pending';
  if (s === 'inactive') return 'badge-inactive';
  return 'badge-inactive';
});
</script>

<style scoped>
.status-badge {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-family: 'Avenir', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  white-space: nowrap;
}

.badge-active {
  padding: 2px 6px;
  background: #ECFDF3;
  border: 1px solid #ABEFC6;
  color: #067647;
}

.badge-pending {
  padding: 2px 6px 2px 4px;
  gap: 4px;
  background: #FFFAEB;
  border: 1px solid #FEDF89;
  color: #B54708;
}

.badge-inactive {
  padding: 2px 6px;
  background: #FEF3F2;
  border: 1px solid #FECDCA;
  color: #B42318;
}
</style>
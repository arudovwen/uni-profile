<template>
  <div
    :class="[
      'p-6 rounded-xl border-[1px] transition-all duration-200 font-Avenir',
      isRegistered
        ? 'border-[#10B981] bg-[#ECFDF5] cursor-not-allowed opacity-75'
        : modelValue
        ? 'border-[#1570EF] bg-[#F0F6FF] cursor-pointer'
        : 'border-[#EAECF5] bg-[#F9FAFB] hover:border-[#1570EF] hover:shadow-md cursor-pointer',
    ]"
    @click="updateSelection"
  >
    <!-- App Icon and Checkbox -->
    <div class="flex items-start justify-between mb-4">
      <!-- App Icon -->
      <div class="flex">
        <img
          v-if="app.iconUrl"
          :src="app.iconUrl"
          :alt="app.name"
          class="w-12 h-12"
        />
        <div
          v-else
          class="w-12 h-12 bg-[#E5E7EB] rounded-lg flex items-center justify-center"
        >
          <span class="text-[#80868B] text-xs font-semibold">{{
            app.name.charAt(0)
          }}</span>
        </div>
      </div>

      <!-- Registered Badge with Checkmark -->
      <div v-if="isRegistered" class="flex items-center gap-2 bg-[#10B981] text-white px-3 py-1 rounded-full text-xs font-semibold">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
        <span>Registered</span>
      </div>
    </div>

    <!-- App Name -->
    <h3 class="text-lg font-semibold text-[#2F2F2F] mb-2">
      {{ app.name }}
    </h3>

    <!-- App Description -->
    <p class="text-sm text-[#475467] font-normal leading-[1.5]">
      {{ app.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface App {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  code: string;
  logoUrl?: string;
  url?: string;
  isRegistered?: boolean;
}

interface Props {
  app: App;
  modelValue: boolean;
  isRegistered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  isRegistered: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const updateSelection = () => {
  // Prevent selection/deselection of registered apps
  if (props.isRegistered) return;
  emit("update:modelValue", !props.modelValue);
};
</script>

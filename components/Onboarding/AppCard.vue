<template>
  <div
    :class="[
      'p-6 rounded-xl border-[1px] transition-all duration-200 font-Avenir relative',
      isRegistered
        ? 'border-[#D0D5DD] bg-[#F9FAFB] cursor-not-allowed opacity-60'
        : modelValue
          ? 'border-[#1570EF] bg-[#F0F6FF] cursor-pointer'
          : 'border-[#EAECF5] bg-[#F9FAFB] hover:border-[#1570EF] hover:shadow-md cursor-pointer',
    ]"
    @click="updateSelection"
  >
    <!-- Registered Badge -->
    <div v-if="isRegistered" class="absolute top-4 right-4">
      <span class="inline-block px-3 py-1 bg-[#D0D5DD] text-[#475467] text-xs font-semibold rounded-full">
        Registered
      </span>
    </div>

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

      <!-- Checkbox -->
      <!-- <div
        :class="[
          'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0',
          modelValue
            ? 'bg-[#1570EF] border-[#1570EF]'
            : 'border-[#D0D5DD] bg-white',
        ]"
      >
        <svg v-if="modelValue" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div> -->
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
  // Prevent selection if app is already registered
  if (props.isRegistered) {
    return;
  }
  emit("update:modelValue", !props.modelValue);
};
</script>

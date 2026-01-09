<template>
  <div
    class="
      w-full h-[237px] p-6
      bg-white border border-[#EAECF5] rounded-xl
      flex flex-col gap-[15px]
      hover:shadow-md transition-shadow cursor-pointer
      font-Avenir
    "
    @click="handleClick"
  >
    <!-- Header: Logo + Status Badge -->
    <div class="flex items-start justify-between">
      <!-- Logo with gradient overlay -->
      <div class="w-[50px] h-[50px] rounded-xl shadow-logo relative overflow-hidden flex-shrink-0">
        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 rounded-xl"
          :style="{
            background: 'linear-gradient(177.61deg, rgba(255, 255, 255, 0) 2%, rgba(255, 255, 255, 0.12) 98.17%)',
          }"
        />

        <!-- Icon -->
        <div class="absolute inset-0 flex items-center justify-center">
          <img
            v-if="app.iconUrl"
            :src="app.iconUrl"
            :alt="app.name"
            loading="lazy"
            class="w-full h-full object-contain p-2"
          />
          <span v-else class="text-white text-xl font-bold">
            {{ app.name.charAt(0).toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Status Badge -->
      <span
        :class="[
          'px-2.5 py-1 rounded-lg text-sm font-medium border whitespace-nowrap flex-shrink-0',
          app.isActive
            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
            : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]',
        ]"
      >
        {{ app.isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-800 text-lg leading-7 text-[#475467] line-clamp-1">
      {{ app.name }}
    </h3>

    <!-- Description -->
    <p class="font-350 text-sm leading-5 text-[#475467] line-clamp-3 flex-grow">
      {{ app.description }}
    </p>

    <!-- Role Badge -->
    <span
      v-if="app.role"
      class="inline-block px-3.5 py-1 text-sm font-medium rounded-[19px] bg-[#EAECF5] text-[#475467] whitespace-nowrap"
    >
      {{ app.role }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface AppCardProps {
  app: {
    code: string;
    name: string;
    description: string;
    iconUrl?: string;
    url?: string;
    isActive: boolean;
    role?: string;
  };
}

const props = defineProps<AppCardProps>();

const emit = defineEmits<{
  (e: 'click', app: AppCardProps['app']): void;
}>();

const handleClick = () => {
  emit('click', props.app);
};
</script>

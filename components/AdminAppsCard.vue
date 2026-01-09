<template>
  <div
    class="w-full h-auto p-6 bg-white border border-[#EAECF5] rounded-xl flex flex-col gap-[15px] hover:shadow-md transition-shadow font-Avenir"
  >
    <!-- Header: Logo + Status Badge -->
    <div class="flex items-start justify-between gap-3">
      <!-- Logo with gradient overlay -->
      <div
        class="w-[50px] h-[50px] rounded-xl relative overflow-hidden flex-shrink-0"
      >
        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 rounded-xl"
          :style="{
            background:
              'linear-gradient(177.61deg, rgba(255, 255, 255, 0) 2%, rgba(255, 255, 255, 0.12) 98.17%)',
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
          app.isDisabled === false
            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
            : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]',
        ]"
      >
        {{ app.isDisabled === false ? "Active" : "Inactive" }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-800 text-lg leading-7 text-[#475467] line-clamp-1">
      {{ app.name }}
    </h3>

    <!-- Description -->
    <p class="font-350 text-sm leading-5 text-[#475467] line-clamp-3 flex-grow">
      {{ app.description || "No description available" }}
    </p>

    <!-- Action Icons -->
    <div class="flex items-center gap-3 pt-2">
      <button
        @click="handleEdit"
        class="flex items-center gap-1.5 text-[#475467] hover:text-primary-600 transition-colors"
        title="Edit application"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        @click="handleDelete"
        class="flex items-center gap-1.5 text-[#D92D20] hover:text-[#B42318] transition-colors"
        title="Delete application"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AdminAppCardProps {
  app: {
    id: string;
    code: string;
    name: string;
    description?: string;
    iconUrl?: string;
    url?: string;
    isDisabled: boolean;
  };
}

const props = defineProps<AdminAppCardProps>();

const emit = defineEmits<{
  (e: "edit", app: AdminAppCardProps["app"]): void;
  (e: "delete", app: AdminAppCardProps["app"]): void;
}>();

const handleEdit = () => {
  emit("edit", props.app);
};

const handleDelete = () => {
  emit("delete", props.app);
};
</script>

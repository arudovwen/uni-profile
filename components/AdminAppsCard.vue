<template>
  <div
    @click="handleCardClick"
    class="w-full h-auto p-6 bg-white border border-[#EAECF5] rounded-xl flex flex-col gap-[15px] hover:shadow-md transition-shadow font-Avenir cursor-pointer"
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
    <h3 class="font-700 text-lg leading-7 text-[#475467] line-clamp-1">
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
        <EditIcon />
      </button>
      <button
        @click="handleDelete"
        class="flex items-center gap-1.5 text-[#D92D20] hover:text-[#B42318] transition-colors"
        title="Delete application"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import EditIcon from "~/assets/images/icon/EditIcon.vue";
import TrashIcon from "~/assets/images/icon/TrashIcon.vue";

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
  (e: "click", app: AdminAppCardProps["app"]): void;
}>();

const handleEdit = (e: Event) => {
  e.stopPropagation();
  emit("edit", props.app);
};

const handleDelete = (e: Event) => {
  e.stopPropagation();
  emit("delete", props.app);
};

const handleCardClick = () => {
  emit("click", props.app);
};

onMounted(() => {
  // Component mounted
  console.log("AdminAppCard mounted", props.app);
});

onUnmounted(() => {
  // Component unmounted
});
</script>

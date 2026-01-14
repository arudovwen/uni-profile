<template>
  <div
    class="w-full p-6 bg-white border border-[#EAECF5] rounded-xl flex flex-col !gap-[17px] hover:shadow-md transition-shadow cursor-pointer font-Avenir"
    @click="handleClick"
  >
    <!-- Header: Logo + Status Badge -->
    <div class="flex items-start justify-between">
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
          app.isActive
            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
            : 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
        ]"
      >
        {{ app.isActive ? "Active" : "Inactive" }}
      </span>
    </div>

    <div class="flex flex-col gap-0.5">
      <!-- Title -->
      <h3 class="font-700 text-lg leading-7 text-[#475467] line-clamp-1">
        {{ app.name }}
      </h3>

      <!-- Description -->
      <p
        class="font-350 text-sm leading-5 text-[#475467] line-clamp-3 flex-grow"
      >
        {{ app.description }}
      </p>
    </div>

    <!-- Role Badge -->
    <span
      class="w-fit px-3.5 py-1 text-sm font-medium rounded-[19px] bg-[#EAECF5] text-[#475467] whitespace-nowrap capitalize"
    >
      {{ getRole(app.role, app) }}
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
  (e: "click", app: AppCardProps["app"]): void;
}>();

onMounted(() => {
  console.log("AppCard mounted with app:", props.app?.customerType);
});

const handleClick = () => {
  emit("click", props.app);
};

const appRoles: Record<string, { default: string }> = {
  OXP975: { default: "Funder" },
  ORB789: { default: "vendor" },
  OXR123: { default: "Member" },
  // Add other app codes and their default roles as needed
};

const getRole = (role: string | undefined, app: any) => {
  if (!role) {
    if (!app?.isActive) {
      return "Not Onboarded";
    }
    return appRoles[app.code]?.default;
  }
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};
</script>

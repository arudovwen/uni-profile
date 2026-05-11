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
            {{ app.name?.charAt(0).toUpperCase() }}
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

    <!-- App User Category Badge -->
    <!-- <span
      v-if="app.appUserCategory"
      class="w-fit px-3.5 py-1 text-xs font-medium rounded-[19px] bg-[#F0F4FF] text-[#3E5EFF] whitespace-nowrap capitalize"
    >
      {{ app.appUserCategory }}
    </span> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { APP_CODES } from "~/utils/app-config";

interface AppCardProps {
  app: {
    code: string;
    name: string;
    description: string;
    iconUrl?: string;
    url?: string;
    isActive: boolean;
    role?: string;
    appUserCategory?: any;
  };
}

const props = defineProps<AppCardProps>();

const emit = defineEmits<{
  (e: "click", app: AppCardProps["app"]): void;
}>();

const handleClick = () => {
  emit("click", props.app);
};

type AppRoleConfig = {
  default: string;
  [key: string]: string;
};

const appRoles: Record<string, AppRoleConfig> = {
  [APP_CODES.OXIDE_PRO]: { default: "Funder" },
  [APP_CODES.ORBITAL]: { default: "vendor" },
  [APP_CODES.OXIDE]: { default: "Member" },
  [APP_CODES.MATTA]: { default: "Member" },
  [APP_CODES.MATTAPEDIA]: {
    default: "Member",
    0: "Admin",
    1: "Owner",
    2: "Procurement Officer",
  },
  // Add other app codes and their default roles as needed
};

onMounted(() => {
  console.log("AppCard mounted with app data:", props.app);
});

const getRole = (role: string | undefined, app: any) => {
  console.log("app = ", app);

  if (app.appUserCategory) {
    return (
      appRoles[app.code]?.[String(app.appUserCategory)] ||
      appRoles[app.code]?.default ||
      "User"
    );
  }
  if (!role) {
    if (!app?.isActive) {
      return "Not Onboarded";
    }
    if (app?.appUserCategory) return appRoles[app.code]?.default;
  }

  const formattedRole = role || "Owner";
  return (
    formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1).toLowerCase()
  );
};
</script>

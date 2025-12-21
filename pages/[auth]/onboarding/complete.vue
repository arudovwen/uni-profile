<template>
  <NuxtLayout name="auth">
    <div class="w-full font-Avenir">
      <!-- Step Indicator at Top Right -->
      <div class="absolute top-8 right-8">
        <OnboardingStepIndicator :currentStep="3" />
      </div>

      <!-- Success Content -->
      <div class="max-w-[600px] mx-auto text-center">
        <!-- Success Icon -->
        <div class="mb-8 flex justify-center">
          <div class="w-24 h-24 bg-[#F0F6FF] rounded-full flex items-center justify-center">
            <svg
              class="w-12 h-12 text-[#1570EF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <!-- Heading -->
        <h1 class="text-3xl font-semibold text-[#2F2F2F] mb-3">
          Setup Complete!
        </h1>

        <!-- Subtext -->
        <p class="text-base text-[#475467] font-normal mb-12">
          You're all set. Your applications and roles have been configured.
        </p>

        <!-- Summary Section -->
        <div class="mb-8 p-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-left">
          <h3 class="text-base font-semibold text-[#2F2F2F] mb-4">
            Your Configuration
          </h3>

          <!-- Selected Apps and Roles -->
          <div class="space-y-4">
            <div
              v-for="selection in summaryData"
              :key="selection.appCode"
              class="p-4 bg-white border border-[#E5E7EB] rounded-lg"
            >
              <div class="flex items-center gap-3 mb-3">
                <img
                  v-if="selection.appIcon"
                  :src="selection.appIcon"
                  :alt="selection.appName"
                  class="w-10 h-10"
                />
                <div v-else class="w-10 h-10 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <span class="text-[#80868B] text-xs font-semibold">
                    {{ selection.appName.charAt(0) }}
                  </span>
                </div>
                <div class="flex-1 text-left">
                  <h4 class="text-base font-semibold text-[#2F2F2F]">
                    {{ selection.appName }}
                  </h4>
                </div>
              </div>

              <!-- Role -->
              <div class="pl-13 text-sm">
                <p class="text-[#475467] font-normal">
                  <span class="font-semibold text-[#2F2F2F]">Role:</span>
                  {{ getRoleLabel(selection.role) }}
                </p>

                <!-- Metadata if available -->
                <div v-if="selection.metadata && Object.keys(selection.metadata).length > 0" class="mt-2 space-y-1">
                  <p
                    v-for="(value, key) in selection.metadata"
                    :key="key"
                    class="text-[#475467] font-normal text-xs"
                  >
                    <span class="font-semibold text-[#2F2F2F]">{{ formatMetadataKey(key) }}:</span>
                    {{ value }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <NuxtLink :to="`/${auth}/dashboard`" class="block">
            <button
              type="button"
              class="w-full py-3 px-4 text-base font-semibold text-white bg-[#1570EF] hover:bg-[#0F5BD3] rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </NuxtLink>

          <button
            type="button"
            class="w-full py-3 px-4 text-base font-semibold text-[#1570EF] bg-transparent hover:bg-[#F0F6FF] rounded-lg transition-colors border border-[#1570EF]"
            @click="editSelection"
          >
            Edit Selection
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12 py-4 border-t border-[#E5E7EB]">
        <p class="text-sm text-[#6B7280]">©Oxide Pro 2025. All rights reserved.</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnboarding } from "~/composables/useOnboarding";

const router = useRouter();
const route = useRoute();
const { auth } = route.params;
const { state, clearOnboarding } = useOnboarding();

interface SummaryItem {
  appCode: string;
  appName: string;
  appIcon?: string;
  role: string;
  metadata?: Record<string, any>;
}

const summaryData = computed(() => {
  const apps = state.value.selectedApps;
  const roles = state.value.roleSelections;

  return apps.map((app) => {
    const roleSelection = roles.find((r) => r.appCode === app.code);
    return {
      appCode: app.code,
      appName: app.name,
      appIcon: app.iconUrl,
      role: roleSelection?.role || "",
      metadata: roleSelection?.metadata,
    };
  });
});

const getRoleLabel = (roleValue: string): string => {
  const roleMap: Record<string, string> = {
    clients: "Clients",
    truckers: "Truckers",
  };
  return roleMap[roleValue] || roleValue;
};

const formatMetadataKey = (key: string): string => {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const editSelection = () => {
  router.push(`/${auth}/onboarding/select-apps`);
};

onMounted(() => {
  if (state.value.selectedApps.length === 0) {
    // No data, redirect to select-apps
    router.push(`/${auth}/onboarding/select-apps`);
  }
});
</script>

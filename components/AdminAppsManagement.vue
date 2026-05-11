<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="apps.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
    >
      <p class="text-[#475467] mb-4">No applications available.</p>
    </div>

    <!-- Apps Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]"
    >
      <!-- App Cards -->
      <AdminAppsCard
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @click="navigateToApp"
        @edit="handleEditApp"
        @delete="handleDeleteApp"
      />

      <!-- Add Application Card -->
      <div
        @click="handleAddApp"
        class="w-full h-[237px] p-6 bg-white border border-[#EAECF5] rounded-xl flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all cursor-pointer font-Avenir"
      >
        <div class="w-12 h-12 rounded-lg flex items-center justify-center">
          <ComputerSvg />
        </div>
        <div class="text-center">
          <h3 class="font-[350] text-base text-[#667085]">Add Application</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Application Modal -->
  <ApplicationModal
    :is-open="isApplicationModalOpen"
    :app="selectedAppForModal"
    @close="closeApplicationModal"
    @submit="handleApplicationSubmit"
  />

  <!-- Navigation / Signup Loading Overlay -->
  <div
    v-if="isNavigating"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-black/20 backdrop-blur-sm"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-[#e5e7eb] border-t-[#1570EF]"
    />
    <p class="text-sm font-semibold text-[#475467]">Opening application, please wait&hellip;</p>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="selectedAppForDelete && isDeleteOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="closeDeleteModal"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold text-[#2F2F2F] mb-2">
        Delete Application
      </h3>
      <p class="text-sm text-[#667085] mb-6">
        Are you sure you want to delete
        <strong>{{ selectedAppForDelete.name }}</strong
        >? This action cannot be undone.
      </p>
      <div class="flex gap-3">
        <button
          @click="closeDeleteModal"
          class="flex-1 px-4 py-2 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB] transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          :disabled="isDeleting"
          class="flex-1 px-4 py-2 bg-[#D92D20] text-white rounded-lg hover:bg-[#B42318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ComputerSvg from "~/assets/images/icon/ComputerSvg.vue";
import { useToast } from "~/composables/useToast";
import { useEncryption } from "~/composables/useEncryption";
import { useOnboarding } from "~/composables/useOnboarding";
import { APP_CODES } from "~/utils/app-config";
import { getSubApps } from "~/services/userservices";

interface App {
  id: string;
  code: string;
  name: string;
  description?: string;
  iconUrl?: string;
  url: string;
  isDisabled: boolean;
}

const toast = useToast();
const authStore = useAuthStore();
const { encrypt, decrypt } = useEncryption();
const { getSignupFunction, buildAppPayload } = useOnboarding();

// Custom app URLs mapping - override API response URLs
const customAppUrls: Record<string, string> = {
  [APP_CODES.OXIDE_PRO]: "https://dev.oxidepro.matta.trade",
  [APP_CODES.ORBITAL]: "https://dev.orbital.matta.trade",
  [APP_CODES.OXIDE]: "https://dev.oxide.matta.trade",
  [APP_CODES.FLUX]: "https://dev.deltalog.co",
  [APP_CODES.MATTA]: "https://dev.matta.trade",
  [APP_CODES.MATTAPEDIA]: "https://dev.mattapedia.matta.trade",
};

const slug = computed(
  () =>
    authStore.userInfo?.companyName?.toLowerCase().replace(/\s+/g, "-") ||
    "default",
);

const apps = ref<App[]>([]);
const isLoading = ref(false);
const selectedApp = ref<App | null>(null);
const selectedAppForDelete = ref<App | null>(null);
const selectedAppForModal = computed(() => selectedApp.value as any);
const isApplicationModalOpen = ref(false);
const isDeleteOpen = ref(false);
const isDeleting = ref(false);
const isNavigating = ref(false);
const encryptedToken = encrypt(authStore.jwToken);
const encryptedRefreshToken = encrypt(authStore.refreshToken);
const encryptedEmail = encrypt((authStore.loggedUser as any)?.email || "");
// Build authenticated URL with encrypted tokens
const buildAuthUrl = (baseUrl: string) => {
  if (!encryptedToken || !encryptedRefreshToken) {
    return baseUrl;
  }

  return `${baseUrl}/auth/validate?token=${encodeURIComponent(
    encryptedToken,
  )}&code=${encodeURIComponent(
    encryptedRefreshToken,
  )}&refreshToken=${encodeURIComponent(encryptedRefreshToken)}`;
};

// Navigate to app URL
const navigateToApp = async (app: App | any) => {
  const appToOpen = app.app || app;
  if (!appToOpen.url) return;

  // For OXI apps, open directly without signup
  if (appToOpen.code.includes("OXI")) {
    const authUrl = buildAuthUrl(appToOpen.url);
    window.open(authUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const payload = buildAppPayload(
    appToOpen.code,
    decrypt(encryptedEmail),
    {
      appCode: appToOpen.code,
      role: authStore.userInfo?.userCategory || 0,
      metadata: {
        appCode: appToOpen.code,
        role: authStore.userInfo?.userCategory || 0,
      },
    },
    slug.value,
    authStore.userInfo?.userCategory || 0,
    authStore.userInfo?.userCategory || 0,
  );

  isNavigating.value = true;
  try {
    await getSignupFunction(appToOpen.code)?.(payload);
    const authUrl = buildAuthUrl(appToOpen.url);
    window.open(authUrl, "_blank", "noopener,noreferrer");
  } catch (err: any) {
    if (err?.response?.data?.message?.includes("Already a")) {
      window.open(appToOpen.url, "_blank", "noopener,noreferrer");
    } else {
      toast.error(
        err?.response?.data?.message ||
          "Failed to open the application. Please try again.",
      );
    }
  } finally {
    isNavigating.value = false;
  }
};

onMounted(() => {
  loadApps();
});

const loadApps = async () => {
  isLoading.value = true;
  try {
    const response = await getSubApps();
    if (response.status === 200) {
      const loadedApps = response.data.data || [];
      // Apply custom URLs if available for matching app codes
      apps.value = loadedApps.map((app: App) => {
        const customUrl = customAppUrls[app.code];
        return {
          ...app,
          description: app.description || "No description available",
          url: customUrl || app.url || "",
        };
      });
    }
  } catch (error) {
    toast.error("Failed to load applications");
    console.error("Error loading apps:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleAddApp = () => {
  selectedApp.value = null;
  isApplicationModalOpen.value = true;
};

const handleEditApp = (app: any) => {
  selectedApp.value = app;
  isApplicationModalOpen.value = true;
};

const handleDeleteApp = (app: any) => {
  selectedAppForDelete.value = app;
  isDeleteOpen.value = true;
};

const closeApplicationModal = () => {
  isApplicationModalOpen.value = false;
  selectedApp.value = null;
};

const closeDeleteModal = () => {
  isDeleteOpen.value = false;
  selectedAppForDelete.value = null;
};

const handleApplicationSubmit = async () => {
  await loadApps();
};

const confirmDelete = async () => {
  if (!selectedAppForDelete.value) return;

  isDeleting.value = true;
  try {
    // TODO: Implement delete API call when available
    // const response = await deleteSubApp(selectedAppForDelete.value.id);
    // if (response.status === 200) {
    toast.success("Application deleted successfully");
    closeDeleteModal();
    await loadApps();
    // }
  } catch (error) {
    toast.error("Failed to delete application");
    console.error("Error deleting app:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

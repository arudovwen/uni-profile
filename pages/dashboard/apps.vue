<template>
  <NuxtLayout name="dashboard">
    <div
      class="font-Avenir max-w-[1120px] mx-auto mt-8 sm:mt-10 lg:mt-[44px] pb-8 lg:px-4"
    >
      <div class="mb-5 sm:mb-[26px] mt-6 sm:mt-10 lg:mt-[60px]">
        <h1
          class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#182230] mb-1 sm:mb-2"
        >
          Welcome back, {{ userName }}!
        </h1>
        <p class="text-xs sm:text-sm lg:text-base text-[#475467]">
          {{
            isAdmin
              ? "Manage all your applications in one place."
              : "Access your applications from your dashboard"
          }}
        </p>
      </div>

      <AdminAppsManagement v-if="isAdmin" />

      <template v-else>
        <div
          v-if="isLoading"
          class="flex justify-center items-center py-8 sm:py-12"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
            role="status"
            aria-label="Loading applications"
          />
        </div>

        <div
          v-else-if="error"
          class="text-center py-8 sm:py-12 px-4 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#EF4444] mb-4 text-sm sm:text-base">{{ error }}</p>
          <button
            @click="fetchUserApps"
            class="px-4 py-2 bg-[#1570EF] text-white text-sm sm:text-base rounded-lg hover:bg-[#0F5BD3] transition-colors"
          >
            Try Again
          </button>
        </div>

        <div
          v-else-if="userApps.length === 0"
          class="text-center py-8 sm:py-12 px-4 bg-white rounded-lg border border-[#E5E7EB]"
        >
          <p class="text-[#475467] mb-4 text-sm sm:text-base">
            No applications registered yet.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-[15px]"
        >
          <DashboardAppCard
            v-for="app in userApps"
            :key="app.code"
            :app="app"
            @click="navigateToApp(app)"
          />
        </div>
      </template>

      <div
        v-if="isNavigating"
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-black/20 backdrop-blur-sm"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-[#e5e7eb] border-t-[#1570EF]"
        />
        <p class="text-sm font-semibold text-[#475467]">
          Opening application, please wait&hellip;
        </p>
      </div>

      <OnboardingModal
        v-if="showOnboardingModal"
        :isOpen="showOnboardingModal"
        :appCode="appToOnboard?.code ?? ''"
        :app="appToOnboard"
        :isOnboarding="isOnboarding"
        @close="
          () => {
            showOnboardingModal = false;
            appToOnboard = null;
          }
        "
        @confirm="handleConfirm"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { getSubApps } from "~/services/userservices";
import { getUserApps } from "~/services/authservices";
import { useEncryption } from "~/composables/useEncryption";
import { useOnboarding } from "~/composables/useOnboarding";
import { toast } from "vue3-toastify";
import FluxLogo from "@/assets/images/flux-logo.png";
import OrbitalLogo from "@/assets/images/orbital-logo.png";
import OxideProLogo from "@/assets/apps/oxide-pro-logo.png";
import { APP_CODES } from "~/utils/app-config";

definePageMeta({ middleware: "auth" });

const authStore: any = useAuthStore();
const { encrypt, decrypt } = useEncryption();
const { getSignupFunction, buildAppPayload } = useOnboarding();

interface UserApp {
  appUserCategory: any;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  url?: string;
  isActive: boolean;
  role?: string;
  customerType?: string;
  status: "Active" | "Inactive" | "Not Onboarded";
}

const APP_ICONS = {
  [APP_CODES.FLUX.code]: FluxLogo,
  [APP_CODES.ORBITAL.code ?? ""]: OrbitalLogo,
  [APP_CODES.OXIDE_PRO.code ?? ""]: OxideProLogo,
  [APP_CODES.POLYMER.code ?? ""]:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%232563EB' x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E",
} as const;
const ADMIN_CATEGORIES = [0, 3];
const PAGE_SIZE = 50;

const userName = computed(() => authStore.userInfo?.firstName || "User");
const isAdmin = computed(() =>
  ADMIN_CATEGORIES.includes(authStore.userInfo?.userCategory),
);
const slug = computed(
  () =>
    authStore.userInfo?.companyName?.toLowerCase().replace(/\s+/g, "-") ||
    "default",
);

const isLoading = ref(true);
const error = ref("");
const userApps = ref<UserApp[]>([]);
const appToOnboard = ref<UserApp | null>(null);
const showOnboardingModal = ref(false);
const isOnboarding = ref(false);
const isNavigating = ref(false);

const encryptedEmail = encrypt(authStore.userInfo?.email || "");
const encryptedToken = encrypt(authStore.jwToken);
const encryptedRefreshToken = encrypt(authStore.refreshToken);
const allowTokenPass = new Set([
  APP_CODES.MATTAPEDIA.code,
  APP_CODES.FLUX.code,
]);

const getUserAppsMap = async (): Promise<Record<string, any>> => {
  if (isAdmin.value) return {};
  try {
    const { data, status } = await getUserApps("1", {
      PageNumber: 1,
      PageSize: PAGE_SIZE,
    });
    if (status === 200) {
      const appsData = data?.data?.data || data?.data || [];
      return Array.isArray(appsData)
        ? appsData.reduce((map, app) => {
            map[app.code] = {
              isDisabled: app.isDisabled,
              customerType: app.customerType,
              iconUrl: app.iconUrl || app.logoUrl,
              description: app.description,
              appUserCategory: app.appUserCategory?.appUserCategory,
            };
            return map;
          }, {} as Record<string, any>)
        : {};
    }
  } catch (err) {
    console.error("Error fetching user apps map:", err);
  }
  return {};
};

const mapAppData = (app: any, userAppsMap: Record<string, any>): UserApp => {
  const appCode = app.appCode || app.code;
  const userAppData = userAppsMap[appCode];
  const isDisabled = userAppData?.isDisabled;
  const userCategory = userAppData?.appUserCategory;
  return {
    code: appCode,
    name: app.appName || app.name,
    description:
      userAppData?.description ||
      app.description ||
      "Access your application dashboard and manage your account.",
    iconUrl:
      APP_ICONS[appCode as keyof typeof APP_ICONS] ||
      userAppData?.iconUrl ||
      app.iconUrl ||
      app.logo,
    url: app.url
      ? buildAuthUrl(
          app.url,
          appCode,
          encryptedToken,
          encryptedRefreshToken,
          allowTokenPass,
          isAdmin.value,
        )
      : undefined,
    isActive: isDisabled === false,
    customerType: userAppData?.customerType,
    appUserCategory: userCategory,
    role: userAppData?.customerType,
    status: !userAppData ? "Not Onboarded" : isDisabled ? "Inactive" : "Active",
  };
};

const fetchUserApps = async () => {
  isLoading.value = true;
  error.value = "";
  try {
    const [userAppsMap, { data, status }] = await Promise.all([
      getUserAppsMap(),
      getSubApps({}),
    ]);
    if (status === 200) {
      userApps.value = (data?.data || data || []).map((app: any) =>
        mapAppData(app, userAppsMap),
      );
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Failed to load applications";
  } finally {
    isLoading.value = false;
  }
};

const navigateToApp = async (app: UserApp) => {
  if (!app.isActive) {
    appToOnboard.value = app;
    showOnboardingModal.value = true;
    return;
  }
  if (!app.url) return;

  // IMPORTANT: To avoid popup blockers, window.open must be called synchronously
  // within the user interaction handler. We open a blank window first and then
  // redirect it once the async signup process is complete.
  let newWindow: Window | null = null;

  // if (app.code.includes("OXI")) {
  //   window.open(app.url, "_blank", "noopener,noreferrer");
  //   return;
  // } else {
  newWindow = window.open("about:blank", "_blank");
  if (newWindow) {
    newWindow.document.write(`
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#475467;background-color:#f9fafb;">
          <div style="width:40px;height:40px;border:4px solid #e5e7eb;border-top:4px solid #1570EF;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <p style="margin-top:16px;font-weight:600;">Opening <span id="app-name"></span>...</p>
          <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </div>
      `);
    const nameEl = newWindow.document.getElementById("app-name");
    if (nameEl) nameEl.textContent = app.name;
    newWindow.document.title = `Opening ${app.name}...`;
  }
  // }

  const ssoCatetory = app.code.includes("POL")
    ? authStore.userInfo?.userCategory
    : 1;
  console.log(
    "App to navigate:",
    app,
    { Buyer: 0, Supplier: 1 }[app.role ?? "Buyer"] ?? 0,
  );
  const payload = buildAppPayload(
    app.code,
    decrypt(encryptedEmail),
    {
      appCode: app.code,
      role: app.code.includes("POL")
        ? authStore.userInfo?.userCategory
        : app.code.includes("MAT")
        ? { Buyer: 0, Supplier: 1 }[app.role ?? "Buyer"] ?? 0
        : app.role,
      metadata: { appCode: app.code, role: app.role },
    },
    slug.value,
    ssoCatetory,
    app.appUserCategory,
    app?.customerType,
  );

  isNavigating.value = true;
  try {
    await getSignupFunction(app.code)?.(payload);
    if (newWindow && !newWindow.closed) {
      const link = newWindow.document.createElement("a");
      link.href = app.url;
      link.rel = "noreferrer";
      newWindow.opener = null;
      newWindow.document.body.appendChild(link);
      link.click();
    } else if (!newWindow || newWindow.closed) {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  } catch (err: any) {
    if (err?.response?.data?.message?.includes("Already a")) {
      if (newWindow && !newWindow.closed) {
        const link = newWindow.document.createElement("a");
        link.href = app.url;
        link.rel = "noreferrer";
        newWindow.opener = null;
        newWindow.document.body.appendChild(link);
        link.click();
      } else {
        window.open(app.url, "_blank", "noopener,noreferrer");
      }
    } else {
      if (newWindow && !newWindow.closed) newWindow.close();
      toast.error(
        err?.response?.data?.message ||
          "Failed to open the application. Please try again.",
      );
    }
  } finally {
    isNavigating.value = false;
  }
};

const handleConfirm = async (selectedRoles: any, conditionalFields: any) => {
  if (!appToOnboard.value) return;
  isOnboarding.value = true;

  try {
    const payload = buildAppPayload(
      appToOnboard.value.code,
      decrypt(encryptedEmail),
      {
        appCode: appToOnboard.value.code,
        role: selectedRoles,
        metadata: conditionalFields,
      },
      slug.value,
    );
    const response = await getSignupFunction(appToOnboard.value.code)?.(
      payload,
    );
    if (response?.status === 200) {
      navigateToApp({ ...appToOnboard.value, isActive: true });
      showOnboardingModal.value = false;
      appToOnboard.value = null;
      await fetchUserApps();
    }
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Onboarding failed. Please try again.",
    );
    showOnboardingModal.value = false;
    appToOnboard.value = null;
  } finally {
    isOnboarding.value = false;
  }
};

onMounted(() => fetchUserApps());
</script>

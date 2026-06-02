<template>
  <IndexModal :isOpen="isOpen" @togglePopup="closeModal">
    <template #content>
      <div class="p-6 max-w-md">
        <!-- Header -->
        <h2 class="text-lg font-semibold text-[#2F2F2F] mb-2">
          Invite new users
        </h2>
        <p class="text-sm text-[#667085] mb-6">
          Invite users to join and manage users on this account. You can invite
          users via a generated link or send invites via email
        </p>

        <!-- Tabs -->
        <!-- <div class="flex gap-4 border-b border-[#E9EAEB] mb-6">
          <button
            @click="activeTab = 'email'"
            :class="[
              'pb-3 text-sm font-medium transition-colors flex items-center gap-2',
              activeTab === 'email'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-[#667085] hover:text-[#2F2F2F]',
            ]"
          >
            <EmailSvg :color="activeTab === 'email' ? '#1570EF' : '#475467'" />
            Invite via email
          </button>
        </div> -->

        <!-- Tab Content -->
        <div v-if="activeTab === 'link'" class="space-y-4">
          <!-- Role Selection for Link Tab -->
          <div class="flex flex-row justify-between">
            <div>
              <label class="block text-sm font-medium text-[#2F2F2F] mb-2">
                Select role
              </label>
              <p class="text-xs text-[#667085] mb-3">
                Signing up via the link will grant this role.
              </p>
            </div>
            <CustomDropdown
              v-model="inviteData.link.role"
              :options="roleOptions"
              placeholder="Select role"
              containerStyles="!w-fit"
              :showSearchFilter="false"
              buttonClass="bg-[#F9FAFB] border-[#E4E7EC] h-8 !font-[12px] rounded-lg !bg-[#F9FAFB]"
            />
          </div>

          <!-- Copy Link Button -->
          <button
            @click="copyInviteLink"
            class="w-fit px-4 py-2 bg-[#1570EF] text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Copy invite link
          </button>
        </div>

        <div v-else class="space-y-4">
          <!-- Email and Role Pairs -->
          <div
            v-for="(pair, index) in inviteData.email.pairs"
            :key="index"
            class="space-y-2"
          >
            <label
              v-if="index === 0"
              class="block text-sm font-medium text-[#2F2F2F] mb-2"
            >
              Email addresses
            </label>
            <div class="flex gap-2 items-center">
              <input
                v-model="pair.emailAddresses"
                type="text"
                placeholder="user@example.com"
                class="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <CustomDropdown
                v-model="pair.role"
                :options="roleOptions"
                placeholder="Select role"
                containerStyles="h-fit !w-fit"
                buttonClass="!rounded-[6px] !bg-[#F9FAFB] !border-[#E4E7EC]"
                :showSearchFilter="false"
                size="sm"
              />
              <!-- <button
                v-if="index > 0"
                @click="removePair(index)"
                class="text-[#D92D20] hover:text-[#B42318] font-medium text-sm"
              >
                Remove
              </button> -->
            </div>

            <div v-if="pair.role?.code === 0" class="space-y-2">
              <label class="block text-sm font-medium text-[#2F2F2F]">
                Select apps
              </label>
              <MultiSelectDropdown
                v-model="pair.apps"
                :options="appOptions"
                placeholder="Select apps"
                containerStyles="w-full"
                buttonClass="!rounded-[6px] !bg-[#F9FAFB] !border-[#E4E7EC] w-full"
                :showSearchFilter="false"
              />
            </div>
          </div>
          <p class="text-xs text-[#667085] mt-2">
            You can use commas to separate multiple email recipients.
          </p>

          <!-- Add Another Role Link -->
          <button
            @click="addAnotherPair"
            :disabled="isLoading"
            class="text-primary-600 text-sm font-medium hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>+</span>
            Add another role
          </button>

          <!-- Send Invite Button -->
          <button
            @click="sendInvites"
            :disabled="
              !inviteData.email.pairs.some((pair) =>
                pair.emailAddresses.trim(),
              ) || isLoading
            "
            class="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? "Sending..." : "Send invite" }}
          </button>
        </div>
      </div>
    </template>
  </IndexModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useToast } from "~/composables/useToast";
import CustomDropdown from "~/components/Onboarding/CustomDropdown.vue";
import MultiSelectDropdown from "~/components/Onboarding/MultiSelectDropdown.vue";
// import AppIcon from "~/components/Icon/AppIcon.vue";
import AppIcon from "./AppIcon.vue";
import CopyLink from "~/assets/images/icon/CopyLink.vue";
import EmailSvg from "~/assets/images/icon/EmailSvg.vue";
import { sendAdminInvite } from "~/services/userservices";

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "invite", data: any): void;
}

interface RoleOption {
  code: any;
  name: string;
}

interface AppOption {
  code: string;
  name: string;
}

interface AppUserCategoryOption {
  code: string;
  name: string;
}

interface InvitePair {
  emailAddresses: string;
  role: RoleOption;
  apps: AppOption[];
  appUserCategories: Record<string, AppUserCategoryOption>;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const toast = useToast();
const authStore = useAuthStore();
const isLoading = ref(false);

const roleOptions: RoleOption[] = [
  { code: 1, name: "Superadmin" },
  { code: 0, name: "Platform Admin" },
];

const appUserCategoryOptions: AppUserCategoryOption[] = [
  { code: "0", name: "Admin" },
  { code: "2", name: "Procurement Manager" },
];

const appOptions = computed<AppOption[]>(() => {
  if (!authStore.appList) return [];
  return authStore.appList
    .map((app: any) => ({
      code: app.code,
      name: app.name || app.code,
    }))
    .filter(
      (app) =>
        app.code !== APP_CODES.MATTAPEDIA.code &&
        app.code !== APP_CODES.ORBITAL.code,
    ); // Exclude the dashboard app
});

const activeTab = ref<"link" | "email">("email");

const inviteData = reactive({
  link: {
    role: roleOptions[0],
  },
  email: {
    pairs: [
      {
        emailAddresses: "",
        role: roleOptions[0],
        apps: [] as AppOption[],
        appUserCategories: {} as Record<string, AppUserCategoryOption>,
      },
    ] as InvitePair[],
  },
});

const syncPairAppUserCategories = (pair: InvitePair) => {
  const selectedCodes = new Set(pair.apps.map((app) => app.code));

  Object.keys(pair.appUserCategories).forEach((appCode) => {
    if (!selectedCodes.has(appCode)) {
      delete pair.appUserCategories[appCode];
    }
  });

  pair.apps.forEach((app) => {
    if (!pair.appUserCategories[app.code]) {
      pair.appUserCategories[app.code] = appUserCategoryOptions[0];
    }
  });
};

watch(
  () => inviteData.email.pairs,
  (pairs) => {
    pairs.forEach((pair) => {
      syncPairAppUserCategories(pair);
    });
  },
  { deep: true },
);

const closeModal = () => {
  emit("close");
};

const copyInviteLink = () => {
  const inviteLink = `https://app.matta.io/invite?role=${inviteData.link.role.code}`;
  navigator.clipboard.writeText(inviteLink);
  toast.success("Invite link copied to clipboard");
};

const sendInvites = async () => {
  // Parse all emails with their roles
  interface EmailToSend {
    email: string;
    role: any;
    pairIndex: number;
    apps: AppOption[];
    appUserCategories: Record<string, AppUserCategoryOption>;
  }

  const emailsToSend: EmailToSend[] = [];
  inviteData.email.pairs.forEach((pair, pairIndex) => {
    const emails = pair.emailAddresses
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    emails.forEach((email) => {
      emailsToSend.push({
        email,
        role: pair.role.code,
        pairIndex,
        apps: pair.apps,
        appUserCategories: pair.appUserCategories,
      });
    });
  });

  if (emailsToSend.length === 0) {
    toast.error("Please enter at least one email address");
    return;
  }

  const invalidPlatformAdminPair = inviteData.email.pairs.find(
    (pair) => pair.role.code === 0 && pair.apps.length === 0,
  );
  if (invalidPlatformAdminPair) {
    toast.error("Please select at least one app for Platform Admin invites");
    return;
  }

  isLoading.value = true;
  const failedEmails: string[] = [];
  const successfulEmails: string[] = [];

  try {
    // Get appCodes from authStore
    const appList = authStore.appList?.map((app: any) => app.code) || [];

    // Send individual request for each email
    for (const item of emailsToSend) {
      try {
        // Build payload based on role
        const payload =
          item.role === 1
            ? { email: item.email, role: item.role, appCodes: appList }
            : {
                email: item.email,
                role: item.role,
                appCodes: item.apps.map((app) => app.code),
                appUserCategory: item.apps.map((app) => ({
                  appCode: app.code,
                  appUserCategory: parseInt(
                    item.appUserCategories[app.code]?.code ?? "0",
                  ),
                })),
              };

        const response = await sendAdminInvite(payload);

        if (response.status === 200) {
          successfulEmails.push(item.email);
        }
      } catch (error) {
        failedEmails.push(item.email);
      }
    }

    // Handle results
    if (failedEmails.length === 0) {
      // All succeeded
      toast.success(`Invite sent to ${successfulEmails.length} user(s)`);
      closeModal();
    } else if (successfulEmails.length > 0) {
      // Some succeeded, some failed - show detailed error
      const failedList = failedEmails.join(", ");
      toast.error(`Failed to send invites to: ${failedList}`);

      // Remove successful emails, keep only failed ones
      inviteData.email.pairs = inviteData.email.pairs
        .map((pair) => {
          const failedInPair = failedEmails.filter((email) => {
            const pairEmails = pair.emailAddresses
              .split(",")
              .map((e) => e.trim());
            return pairEmails.includes(email);
          });
          return {
            ...pair,
            emailAddresses: failedInPair.join(", "),
          };
        })
        .filter((pair) => pair.emailAddresses.trim().length > 0);
    } else {
      // All failed
      toast.error("Failed to send all invites. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};

const addAnotherPair = () => {
  inviteData.email.pairs.push({
    emailAddresses: "",
    role: roleOptions[0],
    apps: [],
    appUserCategories: {},
  });
};

const removePair = (index: number) => {
  inviteData.email.pairs.splice(index, 1);
};

onMounted(() => {
  authStore.getAppsData?.();
});
</script>

<template>
  <IndexModal :isOpen="isOpen" @togglePopup="closeModal">
    <template #content>
      <div class="p-6 max-w-2xl">
        <!-- Header -->
        <h2 class="text-lg font-semibold text-[#2F2F2F] mb-2">
          Invite new users
        </h2>
        <p class="text-sm text-[#667085] mb-6">
          Invite users to join your network and select which apps they can
          access.
        </p>

        <!-- Email and Apps Section -->
        <div class="space-y-4">
          <!-- Input Rows with Labels -->
          <div class="space-y-3">
            <div
              v-for="(pair, index) in inviteData.email.pairs"
              :key="index"
              class="space-y-2"
            >
              <div
                :class="[
                  'grid gap-3',
                  getSelectedAppsWithRoles(pair.apps).length > 0
                    ? 'grid-cols-3'
                    : 'grid-cols-2',
                ]"
              >
                <div>
                  <label class="block text-sm font-medium text-[#2F2F2F] mb-2">
                    Email addresses
                  </label>
                  <input
                    v-model="pair.emailAddresses"
                    type="text"
                    placeholder="user@example.com"
                    class="w-full px-3 py-3 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-[#2F2F2F] mb-2">
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

                <div v-if="getSelectedAppsWithRoles(pair.apps).length > 0">
                  <CustomDropdown
                    v-model="pair.role"
                    :options="
                      roleOptions[getSelectedAppsWithRoles(pair.apps)[0]]
                        .options
                    "
                    :placeholder="`Select role for ${
                      roleOptions[getSelectedAppsWithRoles(pair.apps)[0]].name
                    }`"
                    :label="`Select role for ${
                      roleOptions[getSelectedAppsWithRoles(pair.apps)[0]].name
                    }`"
                    :buttonClass="'w-full rounded-[5px] border-[#E2E2E2]'"
                    :showSearchFilter="false"
                  />
                </div>
              </div>
            </div>
          </div>

          <p class="text-xs text-[#667085] mt-2">
            You can use commas to separate multiple email recipients.
          </p>

          <!-- Add Another Email Link -->
          <button
            @click="addAnotherPair"
            :disabled="isLoading"
            class="text-primary-600 text-sm font-medium hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>+</span>
            Add another email
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
import { ref, reactive, watch, computed } from "vue";
import { useToast } from "~/composables/useToast";
import MultiSelectDropdown from "~/components/Onboarding/MultiSelectDropdown.vue";
import CustomDropdown from "~/components/Onboarding/CustomDropdown.vue";
import { sendAdminInvite, sendOwnerInvite } from "~/services/userservices";
import { a } from "vitest/dist/suite-IbNSsUWN.js";

interface Props {
  isOpen: boolean;
  availableApps: any[];
}

interface Emits {
  (e: "close"): void;
  (e: "invite", data: any): void;
}

interface AppOption {
  code: string;
  name: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const toast = useToast();
const isLoading = ref(false);

// Compute app options from the prop
const appOptions = computed(() => {
  if (!props.availableApps) return [];
  return props.availableApps.map((app: any) => ({
    code: app.code,
    name: app.name || app.code,
  }));
});

// Role options for polymer
const roleOptions = {
  POL628: {
    name: "Polymer",
    options: [
      { code: "0", name: "Admin" },
      { code: "2", name: "Procurement Manager" },
    ],
  },
};

const inviteData = reactive({
  email: {
    pairs: [
      {
        emailAddresses: "",
        apps: [] as AppOption[],
        role: null as any,
      },
    ],
  },
});

const closeModal = () => {
  emit("close");
};

const getSelectedAppsWithRoles = (apps: AppOption[]): string[] => {
  return apps
    .map((app) =>
      Object.keys(roleOptions).find(
        (key) =>
          roleOptions[
            key as keyof typeof roleOptions
          ].name.toLocaleLowerCase() === app.name.toLocaleLowerCase(),
      ),
    )
    .filter((code): code is string => !!code);
};

const hasAppsWithRoles = (apps: AppOption[]): boolean => {
  return getSelectedAppsWithRoles(apps).length > 0;
};

const sendInvites = async () => {
  // Parse emails from all pairs with app and role information
  const emailsToSend = inviteData.email.pairs.flatMap((pair) =>
    pair.emailAddresses
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .map((email) => ({
        email,
        apps: pair.apps,
        role: pair.role,
      })),
  );

  // Validate inputs
  if (emailsToSend.length === 0) {
    toast.error("Please enter at least one email address");
    return;
  }

  if (emailsToSend.some((item) => item.apps.length === 0)) {
    toast.error("Please select at least one app for each email");
    return;
  }

  if (
    inviteData.email.pairs.some(
      (pair) => hasAppsWithRoles(pair.apps) && !pair.role,
    )
  ) {
    const appWithRole = getSelectedAppsWithRoles(
      inviteData.email.pairs.find(
        (pair) => hasAppsWithRoles(pair.apps) && !pair.role,
      )?.apps || [],
    )[0];
    toast.error(
      `Please select a role for ${
        roleOptions[appWithRole as keyof typeof roleOptions]?.name || "this app"
      }`,
    );
    return;
  }

  isLoading.value = true;
  const failedEmails: string[] = [];

  try {
    // Send invites
    for (const item of emailsToSend) {
      try {
        // Build appUserCategory array
        const appUserCategory = item.apps.map((app) => {
          const appWithRole = getSelectedAppsWithRoles([app]);
          const roleVal =
            appWithRole.length > 0 ? parseInt(item.role?.code || "2") : 2;
          return {
            appCode: app.code,
            appUserCategory: roleVal,
          };
        });

        const response = await sendOwnerInvite({
          email: item.email,
          appUserCategory,
          appCodes: item.apps.map((app) => app.code),
          role: 2,
        });

        if (response.status !== 200) {
          failedEmails.push(item.email);
        }
      } catch {
        failedEmails.push(item.email);
      }
    }

    // Handle results
    if (failedEmails.length === 0) {
      toast.success(`Invite sent to ${emailsToSend.length} user(s)`);
      closeModal();
    } else if (failedEmails.length < emailsToSend.length) {
      // Some succeeded
      toast.error(`Failed to send invites to: ${failedEmails.join(", ")}`);
      inviteData.email.pairs = inviteData.email.pairs
        .map((pair) => ({
          ...pair,
          emailAddresses: pair.emailAddresses
            .split(",")
            .map((e) => e.trim())
            .filter((email) => failedEmails.includes(email))
            .join(", "),
        }))
        .filter((pair) => pair.emailAddresses.trim().length > 0);
    } else {
      toast.error("Failed to send all invites. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};

const addAnotherPair = () => {
  inviteData.email.pairs.push({
    emailAddresses: "",
    apps: [] as AppOption[],
    role: null,
  });
};

// Watch for modal opening to reset form
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      // Reset form when modal opens
      inviteData.email.pairs = [
        { emailAddresses: "", apps: [] as AppOption[], role: null },
      ];
    }
  },
);
</script>

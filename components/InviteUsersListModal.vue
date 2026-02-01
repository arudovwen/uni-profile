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
          <!-- Labels Row -->
          <div class="grid grid-cols-2 gap-3">
            <label class="block text-sm font-medium text-[#2F2F2F]">
              Email addresses
            </label>
            <label class="block text-sm font-medium text-[#2F2F2F]">
              Select apps
            </label>
          </div>

          <!-- Input Rows -->
          <div class="space-y-2">
            <div
              v-for="(pair, index) in inviteData.email.pairs"
              :key="index"
              class="grid grid-cols-2 gap-3"
            >
              <input
                v-model="pair.emailAddresses"
                type="text"
                placeholder="user@example.com"
                class="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              />

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
import { sendAdminInvite, sendOwnerInvite } from "~/services/userservices";

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

const inviteData = reactive({
  email: {
    pairs: [
      {
        emailAddresses: "",
        apps: [] as AppOption[],
      },
    ],
  },
});

const closeModal = () => {
  emit("close");
};

const sendInvites = async () => {
  // Parse all emails with their apps
  interface EmailToSend {
    email: string;
    appCodes: string[];
    pairIndex: number;
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
        appCodes: pair.apps.map((app) => app.code),
        pairIndex,
      });
    });
  });

  if (emailsToSend.length === 0) {
    toast.error("Please enter at least one email address");
    return;
  }

  // Check if apps are selected
  if (emailsToSend.some((item) => item.appCodes.length === 0)) {
    toast.error("Please select at least one app for each email");
    return;
  }

  isLoading.value = true;
  const failedEmails: string[] = [];
  const successfulEmails: string[] = [];

  try {
    // Send individual request for each email
    for (const item of emailsToSend) {
      try {
        // Build payload with appCodes
        const payload = {
          email: item.email,
          role: 2, // Default role for non-admin users
          appCodes: item.appCodes,
        };

        const response = await sendOwnerInvite(payload);

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
    apps: [] as AppOption[],
  });
};

// Watch for modal opening to reset form
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      // Reset form when modal opens
      inviteData.email.pairs = [{ emailAddresses: "", apps: [] as AppOption[] }];
    }
  }
);
</script>

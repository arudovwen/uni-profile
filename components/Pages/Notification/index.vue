<template>
  <div class="w-full mx-auto max-w-[640px] px-4 lg:px-0">
    <div class="mb-6">
      <HeaderComponent
        title="Notifications"
        subtext="Manage your notification settings here."
      />
    </div>

    <div class="w-full bg-white rounded-lg py-6 border border-[#E9EAEB] p-4">
      <div class="flex-1" v-if="!loading">
        <!-- Disable All Toggle -->
        <div class="flex justify-between mb-10">
          <h4 class="text-base font-medium">Prevent all notifications?</h4>
          <button
            class="text-sm font-medium text-primary-500"
            @click="disableAll"
          >
            Disable All
          </button>
        </div>

        <!-- Individual Notification Toggles -->
        <div
          v-if="!loading"
          class="mb-6"
          v-for="(setting, index) in notificationData"
          :key="setting.key"
        >
          <SwitchGroup>
            <div class="flex items-center justify-between">
              <SwitchLabel class="mr-4 text-sm font-medium text-gray-700">
                {{ setting.label }}
              </SwitchLabel>
              <Switch
                :modelValue="setting.value"
                @update:modelValue="(val) => toggleSetting(index, val)"
                :class="setting.value ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span
                  :class="setting.value ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
                />
              </Switch>
            </div>
          </SwitchGroup>
        </div>
      </div>
      <div class="p-8" v-if="loading"><AppLoader /></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import {
  getnotificationsettings,
  updatesettings,
} from "~/services/notificationservice";
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();
const loading = ref(false);
const notificationData = ref([
  { label: "Account Notifications", key: "accountNotifications", value: false },
  {
    label: "Finance Request Notifications",
    key: "financeRequestNotification",
    value: false,
  },
  { label: "Order Notifications", key: "orderNotifications", value: false },
  {
    label: "Admin Action Notifications",
    key: "adminActionNotification",
    value: false,
  },
  // {
  //   label: "Disable All Notifications",
  //   key: "disableAllNotification",
  //   value: false,
  // },
]);

// Fetch settings from backend
async function getData() {
  try {
    loading.value = true;
    const { status, data } = await getnotificationsettings({
      userId: store.userId,
    });
    if (status === 200) {
      notificationData.value = notificationData.value.map((setting) => ({
        ...setting,
        value: data[setting.key] ?? false,
      }));
    }
  } finally {
    loading.value = false;
  }
}

// Update settings on backend
async function handleSettingUpdate() {
  const payload = notificationData.value.reduce(
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    { userId: store.userId }
  );

  try {
    await updatesettings({ ...payload });
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
}

// Toggle individual setting
function toggleSetting(index, value) {
  notificationData.value[index].value = value;
  handleSettingUpdate();
}

// Disable all notifications
function disableAll() {
  notificationData.value = notificationData.value.map((setting) => ({
    ...setting,
    value: false,
  }));
  handleSettingUpdate();
}

// Initial fetch
onMounted(() => {
  getData();
});
</script>

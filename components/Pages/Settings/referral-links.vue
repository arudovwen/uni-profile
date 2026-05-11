<template>
  <div class="p-6 bg-white rounded-lg w-[400px]">
    <h1 class="mb-6 text-lg font-semibold">Referral Links</h1>

    <ul class="grid gap-y-2">
      <li
        v-for="app in appInfo"
        class="flex items-center justify-between gap-x-2"
      >
        <span class="font-medium">{{ app.name }}</span>
        <div>
          <button
            @click="copyToClipboard(app)"
            type="button"
            class="flex items-center text-xs gap-x-2.5 bg-[#EAECF5] rounded-lg px-2.5 py-2 cursor-copy"
          >
            <AppIcon icon="lucide:copy" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { toast } from "vue3-toastify";

const props = defineProps(["refDetail"]);
const authStore = useAuthStore();
const appInfo = computed(() =>
  authStore.appList?.filter(
    (app) =>
      !app.isDisabled &&
      props.refDetail?.assignedApps
        ?.toLowerCase()
        .includes(app.name?.toLowerCase()),
  ),
);

function copyToClipboard(app) {
  const path = window.location.origin;
  const appName = app.name;
  const appCode = app.code;
  const appUrl = app.defaultUrl;

  const refCode = props.refDetail.referralCode;
  const text = `${path}/auth/register/${appCode}?continue=${appUrl}&referral_code=${refCode}&name=${appName}`;
  navigator.clipboard.writeText(text).then(
    () => {
      // Success feedback can be added here
      toast.success("Referral link copied to clipboard!");
    },
    (err) => {
      console.error("Could not copy text: ", err);
    },
  );
}
</script>

<template>
  <div class="w-full mx-auto max-w-[640px] px-4 lg:px-0 py-10">
    <!-- Top bar -->
    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="Applications"
        subtext="Manage all your applications in one place."
      />
    </div>

    <!-- Table -->
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <CustomTable
        :columns="columns"
        :rows="rows"
        emptyTitle="No application available"
        emptyType="user"
        :isLoading="setLoader"
      >
        <!-- Name Column -->
        <template #table-row-name="{ row }">
          <span class="capitalize flex gap-x-2 items-center">
            <img class="h-4" :src="row.iconUrl" />
            <span class="capitalize block font-medium">{{ row.name }}</span>
          </span>
        </template>

        <!-- Status Column -->
        <template #table-row-isDisabled="{ row }">
          <AppStatusButton stattype="driver" :status="row.isDisabled ? 2 : 1" />
        </template>
      </CustomTable>
    </div>
  </div>

  <!-- Delete Modal -->
  <DeleteModal
    @deleteItem="handleDelete"
    @close="open = false"
    title="Delete account"
    text="Are you sure you want to delete this account? This action cannot be undone."
    :open="open"
    btnText="Yes, Delete"
  />
</template>

<script setup>
import { Float } from "@headlessui-float/vue";
import {
  Menu,
  MenuButton,
  MenuItems,
  Switch,
  SwitchGroup,
} from "@headlessui/vue";
import { getSubApps, editSubApp } from "~/services/userservices";

import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";

definePageMeta({
  layout: "dashboard",
});

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);
const rows = ref([]);
const columns = [
  { header: "Application", key: "name", isHtml: false, isStatus: false },
  { header: "Status", key: "isDisabled", isHtml: false, isStatus: false },
  { header: "Last active", key: "action", isHtml: false, isStatus: false },
];

onMounted(() => {
  getData();
});

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  Type: "",
});

function getData() {
  setLoader.value = true;
  getSubApps()
    .then((res) => {
      if (res.status === 200) {
        setLoader.value = false;
        rows.value = res.data.data;
      }
    })
    .catch(() => {
      setLoader.value = false;
    });
}

function toggleTwoFactorAuth(row) {
  editSubApp({ ...row, isTwoFactorAuthEnabled: !row.isTwoFactorAuthEnabled })
    .then((res) => {
      if (res.status === 200) {
        toast.info("Updated successfully");
      }
    })
    .catch((err) => {
      console.error("Failed to update 2FA status:", err);
    });
}

const handleDelete = () => {
  // Handle delete logic here
};

watch(
  () => [queryParams.Search],
  debounce(() => getData(), 800)
);

watch(
  () => [queryParams.PageNumber, queryParams.SortOrder],
  () => getData()
);
</script>

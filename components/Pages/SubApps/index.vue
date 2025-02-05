<template>
  <div class="w-full">
    <!-- Top bar -->
    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="Applications"
        subtext="Manage all your applications in one place."
      />
      <div>
        <AppButton
          @click="navigateTo('/application-management/create')"
          text="New Application"
          icon="humbleicons:plus"
          :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm`"
        />
      </div>
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
        <!-- Row Actions -->
        <template #table-row-action="{ row }">
          <Menu class="" as="div">
            <Float placement="bottom-end" :offset="4">
              <MenuButton class="outline-none">
                <AppIcon icon="heroicons:ellipsis-vertical-solid" />
              </MenuButton>
              <MenuItems
                class="z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-2 min-w-[150px] rounded-xl overflow-hidden flex flex-col items-start gap-y-[2px] justify-start"
              >
                <button
                  type="button"
                  @click="
                    detail = row;
                    id = detail.id;
                    isOpen = true;
                    navigateTo(`/application-management/edit/${row.id}`);
                  "
                  class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap cursor-pointer w-full text-left"
                >
                  Edit application
                </button>
              </MenuItems>
            </Float>
          </Menu>
        </template>

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

        <!-- 2FA Enabled Column -->
        <template #table-row-isTwoFactorAuthEnabled="{ row }">
          <div class="max-w-[280px]">
            <SwitchGroup>
              <div class="flex items-center justify-start gap-x-1">
                <Switch
                  v-model="row.isTwoFactorAuthEnabled"
                  :class="
                    row.isTwoFactorAuthEnabled ? 'bg-green-700' : 'bg-gray-200'
                  "
                  class="relative inline-flex h-5 w-[38px] items-center rounded-full transition-colors focus:outline-none"
                  @click="toggleTwoFactorAuth(row)"
                >
                  <span
                    :class="
                      row.isTwoFactorAuthEnabled
                        ? 'translate-x-5'
                        : 'translate-x-[2px]'
                    "
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </SwitchGroup>
          </div>
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
  { header: "Application Code", key: "code", isHtml: false, isStatus: false },
  { header: "Application URL", key: "url", isHtml: false, isStatus: false },
  {
    header: "2FA Enabled",
    key: "isTwoFactorAuthEnabled",
    isHtml: false,
    isStatus: false,
  },
  { header: "Status", key: "isDisabled", isHtml: false, isStatus: false },
  { header: "", key: "action", isHtml: false, isStatus: false },
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

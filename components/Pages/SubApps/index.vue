<template>
  <div class="w-full mx-auto max-w-[1200px] px-4 lg:px-0 py-10">
    <!-- Top bar   -->

    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="Applications"
        subtext="Manage all your applicatinos in one place."
      />
      <div>
        <AppButton
          @click="isOpen = true"
          text="New Applicaiton"
          icon="humbleicons:plus"
          :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm`"
        />
      </div>
    </div>
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <CustomTable
        :columns="columns"
        :rows="rows"
        emptyTitle="No application available"
        emptyType="user"
        :isLoading="setLoader"
      >
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
                  "
                  class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap cursor-pointer w-full text-left"
                >
                  Edit application
                </button>
              </MenuItems>
            </Float>
          </Menu>
        </template>
        <template #table-row-isTwoFactorAuthEnabled="{ row }">
          <span class="capitalize">{{ row.isTwoFactorAuthEnabled }}</span>
        </template>
        <template #table-row-name="{ row }">
          <span class="capitalize flex gap-x-2 items-center">
            <img class="h-4" :src="row.iconUrl" />
            <span class="">
              <span class="capitalize block font-medium">{{ row.name }}</span>
            </span>
          </span>
        </template>
        <template #table-row-isDisabled="{ row }">
          <AppStatusButton stattype="driver" :status="row.isDisabled ? 2 : 1" />
        </template>
      </CustomTable>
    </div>
  </div>
  <DeleteModal
    @deleteItem="handleDelete"
    @close="open = false"
    title="Delete account"
    text="Are you sure you want to delete this account? This action cannot be undone."
    :open="open"
    btnText="Yes, Delete"
  />
  <IndexModal :isOpen="isOpen" @togglePopup="isOpen = false" v-if="isOpen">
    <template #content>
      <div class="h-full w-full bg-white rounded-lg p-6">
        <PagesSubAppsCreateForm
          :id="id"
          :detail="detail"
          @refresh="getData()"
        />
      </div>
    </template>
  </IndexModal>
</template>
<script setup>
import { Float } from "@headlessui-float/vue";
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { getSubApps } from "~/services/userservices";

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);
const authStore = useAuthStore();
const isAutoSettlement = ref(false);
const rows = ref([]);
const loading = ref(false);
const columns = [
  {
    header: "Name",
    key: "name",
    isHtml: false,
    isStatus: false,
  },

  {
    header: "Code",
    key: "code",
    isHtml: false,
    isStatus: false,
  },

  {
    header: "App ID",
    key: "id",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "App URL",
    key: "url",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "2FA Enabled",
    key: "isTwoFactorAuthEnabled",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Status",
    key: "isDisabled",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "",
    key: "action",
    isHtml: false,
    isStatus: false,
  },
];
const financeData = ref([]);

onMounted(() => {
  getData();
});
const settlementValue = ref(null);
const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  Type: "",
});
const docLoading = ref(false);
function getData() {
  setLoader.value = true;
  getSubApps()
    .then((res) => {
      if (res.status === 200) {
        setLoader.value = false;
        rows.value = res.data.data;
        queryParams.totalCount = res.data.data.totalCount;
        docLoading.value = false;
      }
    })
    .catch(() => {
      setLoader.value = false;
    });
}

function deleteRequest(value) {
  id.value = value;
  open.value = true;
}
const document = ref({});
function openRequest(val) {
  detail.value = val;
  isOpen.value = true;
}
const debounceSearch = debounce(() => {
  getFinanceData();
}, 800);
const handleDelete = () => {
  // deleteSettlement(id.value)
  //   .then((res) => {
  //     if (res.status === 200) {
  //       getDatas();
  //       isSuccessOpen.value = true;
  //     }
  //   })
  //   .catch((err) => {
  //     errorText.value =
  //       err?.response?.data?.message ||
  //       err?.response?.data?.Message ||
  //       "Account deletion failed";
  //     isErrorOpen.value = true;
  //     isLoading.value = false;
  //   });
};
function handleSuccess() {
  getFinanceData();
}
watch(
  () => [queryParams.Search],
  () => {
    debounceSearch();
  }
);
watch(
  () => [queryParams.PageNumber, queryParams.SortOrder],
  () => {
    getFinanceData();
  }
);
watch(isAutoSettlement, (oldval, newval) => {
  if (oldval === newval) return;
  handleAutoSettlement();
});
function handleAutoSettlement() {
  setLoader.value = true;
  autoSettlement({ autoSettlement: isAutoSettlement.value })
    .then((res) => {
      setLoader.value = false;
    })
    .catch(() => {
      setLoader.value = false;
    });
}
provide("handleSuccess", handleSuccess);
provide("isOpen", isOpen);
</script>

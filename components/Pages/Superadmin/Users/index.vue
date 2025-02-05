<template>
  <div class="w-full ">
    <!-- Top bar   -->

    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="User Management"
        subtext="Manage your team members and their account permissions here."
      />
      <div>
        <AppButton
          @click="isOpen = true"
          text="Invite User"
          icon="humbleicons:plus"
          :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm`"
        />
      </div>
    </div>
<hr class="my-7" />
    <div class="flex">
      <LazyPagesSuperadminUsersTable />

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
        <LazyPagesSuperadminUsersInviteForm @refresh="getFinanceData()" />
      </div>
    </template>
  </IndexModal>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import {
  viewSettlement,
  deleteSettlement,
  autoSettlement,
  getAutoSettlement,
} from "~/services/settlementservice";

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);

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
    header: "Role",
    key: "role",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Last active",
    key: "lastActive",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Apps",
    key: "apps",
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
const active = ref("users");
const tabs = [
  {
    title: "Users",
    key: "users",
  },
  {
    title: "Roles",
    key: "roles",
  },
];
const financeData = ref([]);

onMounted(() => {
  getSettlement();
  getFinanceData();
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
function getSettlement() {
  setLoader.value = true;
  getAutoSettlement()
    .then((res) => {
      if (res.status === 200) {
        setLoader.value = false;
        isAutoSettlement.value = res.data.data.autoSettlement;
      }
    })
    .catch(() => {
      setLoader.value = false;
    });
}
function getFinanceData() {
  docLoading.value = true;
  viewSettlement(queryParams).then((res) => {
    financeData.value = res.data.data;
    queryParams.totalCount = res.data.data.totalCount;
    docLoading.value = false;
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
  deleteSettlement(id.value)
    .then((res) => {
      if (res.status === 200) {
        getSettlements();
        isSuccessOpen.value = true;
      }
    })
    .catch((err) => {
      errorText.value =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Account deletion failed";
      isErrorOpen.value = true;
      isLoading.value = false;
    });
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

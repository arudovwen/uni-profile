<template>
  <div class="w-full">
    <div class="">
      <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
        <CustomTable
          :columns="columns"
          :rows="rows"
          emptyTitle="No user available"
          :isLoading="loading"
          emptyType="user"
        >
          <template #table-row-action="{ row }">
            <Menu class="" as="div">
              <Float placement="bottom-end" :offset="4">
                <MenuButton class="outline-none ml-auto block">
                  <AppIcon icon="heroicons:ellipsis-vertical-solid" />
                </MenuButton>
                <MenuItems
                  class="z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-1 min-w-[150px] rounded-xl overflow-hidden flex flex-col items-start gap-y-[2px] justify-start"
                >
                  <MenuItem>
                    <button
                      type="button"
                      @click="navigateTo(`/user-management/user-detail/1`)"
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="iconamoon:edit-light" /> View Details
                    </button></MenuItem
                  >
                  <MenuItem>
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        isOpen = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="ic:outline-cancel" /> Cancel Invite
                    </button></MenuItem
                  >
                  <MenuItem>
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        isOpen = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="la:user-minus" /> Deactivate access
                    </button></MenuItem
                  >
                  <MenuItem>
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        isOpen = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="tabler:trash" /> Delete user
                    </button></MenuItem
                  >
                </MenuItems>
              </Float>
            </Menu>
          </template></CustomTable
        >
      </div>
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
        <PagesSettlementsForm
          :id="id"
          :detail="detail"
          @refresh="getFinanceData()"
        />
      </div>
    </template>
  </IndexModal>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  viewSettlement,
  deleteSettlement,
  autoSettlement,
  getAutoSettlement,
} from "~/services/settlementservice";
import { Float } from "@headlessui-float/vue";

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);
const authStore = useAuthStore();
const isAutoSettlement = ref(false);
const rows = ref([{}]);
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
    header: "Apps",
    key: "apps",
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

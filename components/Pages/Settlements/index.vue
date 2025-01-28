<template>
  <div class="w-full mx-auto max-w-[940px] px-4 lg:px-0">
    <!-- Top bar   -->

    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent
        title="Settlements account"
        subtext="Account where your funds would be paid into"
      />
      <div>
        <AppButton
          @click="isOpen = true"
          text="Add settlement account"
          icon="humbleicons:plus"
          :btnClass="`!px-[10px] md:!px-[14px] !py-[10px] bg-primary-500 !text-white !text-sm`"
        />
      </div>
    </div>
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <div v-if="!docLoading">
        <div v-if="financeData?.length">
          <table aria-describedby="true" class="w-full">
            <thead>
              <tr>
                <th
                  v-for="item in theads"
                  :key="item"
                  class="capitalize text-[#475467] text-sm text-left font-medium border-t border-b py-3 px-6 border-[#EAECF0] whitespace-nowrap bg-[#F9FAFB]"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in financeData" :key="item">
                <td
                  class="capitalize flex gap-x-2 items-center text-matta-black text-sm font-normal border-b py-4 px-6 border-[#EAECF0] whitespace-nowrap"
                >
                  <span> {{ item.accountName }} </span
                  ><span
                    v-if="item.isPrimaryAccount"
                    class="bg-gray-100 text-xs font-medium px-[6px] py-[3px] rounded"
                    >Primary</span
                  >
                </td>
                <td
                  :class="item.status == 3 ? 'opacity-25' : ''"
                  class="capitalize text-matta-black text-sm font-normal border-b py-4 px-6 border-[#EAECF0] whitespace-nowrap max-w-[260px] truncate"
                >
                  {{ item.accountNumber || "-" }}
                </td>
                <td
                  class="capitalize text-matta-black text-sm font-normal border-b py-4 px-6 border-[#EAECF0] whitespace-nowrap"
                >
                  {{ item.bankName }}
                </td>

                <td
                  class="capitalize text-matta-black text-sm font-normal border-b py-4 px-6 border-[#EAECF0] whitespace-nowrap"
                >
                  <Menu class="relative" as="div">
                    <MenuButton
                      :id="`${item.accountName}+option`"
                      class="outline-none"
                    >
                      <AppIcon icon="heroicons:ellipsis-vertical-solid" />
                    </MenuButton>
                    <MenuItems
                      class="absolute z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-2 right-0 min-w-[180px] rounded-xl overflow-hidden"
                    >
                      <div
                        class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap flex gap-x-1 items-center"
                      >
                        <AppIcon
                          icon="fluent:star-28-regular"
                          class="text-yellow-600"
                        />
                        Set as settlement
                      </div>

                      <div
                        @click="deleteRequest(item.id)"
                        class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap flex gap-x-1 items-center"
                      >
                        <AppIcon
                          icon="mingcute:delete-2-line"
                          class="text-red-600"
                        />
                        Delete
                      </div>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyData v-else title="No settlement available" type="settlement" />
      </div>
      <div class="text-center p-6 lg:p-8 my-20" v-if="docLoading">
        <AppLoader />
      </div>

      <!-- <div class="p-5" v-if="financeData.length">
        <PaginationSimple
          :total="queryParams.totalCount"
          :current="queryParams.PageNumber"
          :per-page="queryParams.PageSize"
          :pageRange="5"
          @page-changed="queryParams.PageNumber = $event"
        />
      </div> -->
    </div>

    <!-- <div>
      <div class="mb-6">
        <FormGroup label="How do you want to get your earnings" name="earings">
          <div class="grid gap-y-[6px]">
            <Checkbox
              v-model="settlementValue"
              label="Settle to my bank account"
            />
            <Checkbox v-model="settlementValue" label="Settle to my wallet" />
          </div>
        </FormGroup>
      </div>
      <AppButton
        text="Save changes"
        btnClass="bg-primary-500 text-white rounded-lg px-[14px] py-[10px]"
      />
    </div> -->
    <div class="max-w-[280px]">
      <SwitchGroup>
        <div class="flex items-center justify-start gap-x-1">
          <SwitchLabel class="mr-4 whitespace-nowrap font-medium">{{
            `${!isAutoSettlement ? "Activate" : "Deactivate"} auto settlement`
          }}</SwitchLabel>
          <Switch
            v-model="isAutoSettlement"
            :class="isAutoSettlement ? 'bg-blue-600' : 'bg-gray-200'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
          >
            <span
              :class="isAutoSettlement ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </Switch>
          <AppIcon v-if="setLoader" icon="fa:spinner" iconClass="fa-spin" />
        </div>
      </SwitchGroup>
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
import AppIcon from "~/components/AppIcon";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
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
const authStore = useAuthStore();
const isAutoSettlement = ref(false);

const theads = ["account name", "account number", "bank", ""];
const financeData = ref([]);

onMounted(() => {
  getSettlement()
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

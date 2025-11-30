<template>
  <div class="w-full">
    <div
      class="flex flex-col bg-white w-full border-1px rounded-[10px] border-[#F4F7FE]"
    >
      <div class="flex flex-row justify-between py-5 px-6">
        <div class="flex flex-col gap-1">
          <span
            class="font-manrope font-semibold text-[18px] leading-[28px] tracking-[0%] text-[#101828]"
          >
            Referral Management System
          </span>
          <span
            class="font-manrope font-normal text-[14px] leading-[20px] tracking-[0%] text-[#475467]"
            >Manage all referral codes
          </span>
        </div>
        <AppButton
          text="New Referral Code"
          :icon="`humbleicons:plus`"
          :btnClass="`!bg-[#165EF0] h-10 border-[#165EF0] !text-[14px] !py-2.5 !leading-5 text-white `"
          iconClass="text-sm md:text-base"
          @click="navigateTo('/referral-management/create')"
        />
      </div>
      <div
        class="border-y-[1px] border-[#EAECF0] py-4 px-6 flex flex-row items-center gap-3"
      >
        <div
          class="relative border-[1px] rounded-md border-[#DFE5EC] flex flex-row gap-2 px-4 items-center"
        >
          <span class="text-[#667085]">
            <i class="uil uil-search"> </i>
          </span>
          <input
            type="search"
            placeholder="Search by referral code"
            v-model="queryParams.ReferralCode"
            @input="debounceSearch"
            class="font-manrope font-medium text-[16px] leading-6 tracking-normal rounded-lg w-full lg:w-[320px] h-11 outline-none focus:outline-none"
          />
        </div>
        <filter-button
          v-model="queryParams.status"
          :options="filterOptions"
          placeholder="Status"
          :classInput="`min-w-[100px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer  'border-[#D0D5DD]'`"
        />
      </div>
      <div class="mb-6 bg-white w-full">
        <div
          v-if="!loading && rows.length < 1"
          class="flex flex-col items-center gap-4 py-[140px]"
        >
          <svgs-loudspeaker />
          <span
            class="font-manrope font-semibold text-[16px] leading-6 tracking-normal text-center"
            >No referral code has been created</span
          >
          <AppButton
            text="New Referral Code"
            :icon="`humbleicons:plus`"
            :btnClass="`!bg-[#165EF0] border-[#165EF0] !text-[14px] !py-2.5 !leading-5 text-white `"
            iconClass="text-sm md:text-base"
            @click="navigateTo('/referral-management/create')"
          />
        </div>
        <CustomTable
          v-else
          :columns="columns"
          :rows="rows"
          emptyTitle="No referral code has been created"
          :isLoading="loading"
          emptyType="referral"
          className="!rounded-0 !border-0 !shadow-none"
          :query="queryParams"
          @onPageChange="(value) => (queryParams.PageNumber = value)"
        >
          <template #table-row-status="{ row }">
            <AppStatusButton stattype="referral" :status="row.status" />
          </template>
          <template #table-row-assignedUser="{ row }">
            <span>{{ row.assignedUser }}</span>
          </template>
          <template #table-row-assignedUserEmail="{ row }">
            <span>{{ row.assignedUserEmail }}</span>
          </template>
          <template #table-row-assignedDepartment="{ row }">
            <span>{{ row.assignedDepartment }}</span>
          </template>
          <template #table-row-assignedApps="{ row }">
            <div class="flex flex-wrap gap-1">
              {{ row.assignedApps }}
            </div>
          </template>
          <template #table-row-created_On="{ row }">
            <span>{{ moment(row.created_On).format("DD MMM YYYY") }}</span>
          </template>
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
                      @click="handleEdit(row)"
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      Edit Referral code
                    </button></MenuItem
                  >
                  <template v-if="row.status !== 1">
                    <MenuItem>
                      <button
                        type="button"
                        @click="handleActivate(row)"
                        class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                      >
                        Deactivate Code
                      </button>
                    </MenuItem>
                  </template>
                  <template v-else>
                    <MenuItem>
                      <button
                        type="button"
                        @click="handleDeactivate(row)"
                        class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                      >
                        Activate Code
                      </button>
                    </MenuItem>
                  </template>
                  <MenuItem>
                    <button
                      type="button"
                      @click="handleDelete(row)"
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      Delete code
                    </button>
                  </MenuItem>
                </MenuItems>
              </Float>
            </Menu>
          </template>
        </CustomTable>
      </div>
    </div>
  </div>
  <DeleteModal
    @close="deleteModalOpen = false"
    :title="`Delete Referral Code`"
    :text="`Are you sure you want to delete the referral code '${selectedReferralForDelete?.referralCode}'? This action cannot be undone.`"
    :open="deleteModalOpen"
    :loading="deleteLoading"
    btn-text="Delete"
    @deleteItem="confirmDelete"
  />
</template>
<script setup>
import AppButton from "~/components/AppButton.vue";
import AppIcon from "~/components/AppIcon.vue";
import CustomTable from "~/components/CustomTable/index.vue";
import AppStatusButton from "~/components/AppStatusButton.vue";
import DeleteModal from "~/components/DeleteModal.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
import {
  getReferrals,
  updateReferralStatus,
  deleteReferral,
} from "~/services/userservices";
import { toast } from "vue3-toastify";
import debounce from "lodash/debounce";
import moment from "moment";

const queryParams = reactive({
  ReferralCode: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  userCatText: "",
  userCategories: [2],
  status: "",
  total: 0,
});

const filterOptions = [
  {
    label: "All",
    key: "all",
    value: "",
  },
  {
    label: "Active",
    key: "active",
    value: 0,
  },
  {
    label: "Inactive",
    key: "inactive",
    value: 1,
  },
];

const rows = ref([]);
const loading = ref(false);
const deleteModalOpen = ref(false);
const deleteLoading = ref(false);
const selectedReferralForDelete = ref(null);

const columns = [
  {
    header: "Referral Code",
    key: "referralCode",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Assigned User",
    key: "assignedUser",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Department",
    key: "assignedDepartment",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Assigned Apps",
    key: "assignedApps",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Created",
    key: "created_On",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Status",
    key: "status",
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

onMounted(() => {
  fetchReferrals();
});

async function fetchReferrals() {
  loading.value = true;
  try {
    const res = await getReferrals(queryParams);
    rows.value = res.data.data || [];
    queryParams.total = res.data.totalCount || 0;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to fetch referrals"
    );
  } finally {
    loading.value = false;
  }
}

const debounceSearch = debounce(() => {
  queryParams.PageNumber = 1;
  fetchReferrals();
}, 800);

// Watch for pagination changes
watch(
  () => queryParams.PageNumber,
  () => {
    fetchReferrals();
  }
);

// Watch for status filter changes
watch(
  () => queryParams.status,
  () => {
    queryParams.PageNumber = 1;
    fetchReferrals();
  }
);

function handleEdit(row) {
  navigateTo(`/referral-management/edit/${row.referralCode}`);
}

async function handleActivate(row) {
  try {
    await updateReferralStatus(row.referralCode, 1);
    toast.success("Referral code activated successfully");
    fetchReferrals();
  } catch (error) {
    console.error("Error activating referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to activate referral code"
    );
  }
}

async function handleDeactivate(row) {
  try {
    await updateReferralStatus(row.referralCode, 0);
    toast.success("Referral code deactivated successfully");
    fetchReferrals();
  } catch (error) {
    console.error("Error deactivating referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to deactivate referral code"
    );
  }
}

function handleDelete(row) {
  selectedReferralForDelete.value = row;
  deleteModalOpen.value = true;
}

async function confirmDelete() {
  console.log("Deleting");

  try {
    deleteLoading.value = true;
    await deleteReferral(selectedReferralForDelete.value.id);
    toast.success("Referral code deleted successfully");
    deleteModalOpen.value = false;
    fetchReferrals();
  } catch (error) {
    console.error("Error deleting referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to delete referral code"
    );
  } finally {
    deleteLoading.value = false;
  }
}
</script>

<template>
  <div class="font-Avenir overflow-hidden">
    <DashboardTableFilters
      v-model="searchQuery"
      search-placeholder="Search by referral code"
      @search="handleSearch"
      @download="handleDownload"
    >
      <template #filters>
        <DashboardFilterDropdown
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Status"
          @change="handleFilterChange"
        />
      </template>
    </DashboardTableFilters>

    <div
      v-if="rows.length > 0 || isLoading"
      class="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden"
    >
      <div class="overflow-x-auto">
        <DashboardDataTable
          :columns="columns"
          :data="rows"
          :loading="isLoading"
          :show-actions="true"
          :actions="actions"
          :paginator="false"
          body-cell-class="px-6 py-4 text-sm font-medium text-[#475467]"
          empty-message="No referral code has been created"
          @action="handleAction"
        >
          <template #cell-referralCode="slotProps">
            <button
              type="button"
              class="text-[#1570EF] hover:underline"
              @click="openReferralLinks(slotProps.data)"
            >
              {{ slotProps.data.referralCode }}
            </button>
          </template>

          <template #cell-assignedUser="slotProps">
            <span>{{ slotProps.data.assignedUser || "-" }}</span>
          </template>

          <template #cell-assignedDepartment="slotProps">
            <span>{{ slotProps.data.assignedDepartment || "-" }}</span>
          </template>

          <template #cell-assignedApps="slotProps">
            <span>{{ slotProps.data.assignedApps || "-" }}</span>
          </template>

          <template #cell-created_On="slotProps">
            <span>{{ formatDate(slotProps.data.created_On) }}</span>
          </template>

          <template #cell-status="slotProps">
            <AppStatusButton stattype="referral" :status="slotProps.data.status" />
          </template>
        </DashboardDataTable>
      </div>

      <div
        class="flex flex-col sm:flex-row relative justify-center items-center gap-3 sm:gap-0 py-3 sm:py-4 px-4 sm:px-6 border-t border-[#F2F4F7]"
      >
        <div
          class="text-xs sm:text-sm text-[#344054] sm:absolute sm:left-6 font-medium"
        >
          {{ 1 }} - {{ rows.length }}
        </div>
        <button
          @click="handleLoadMore"
          :disabled="rows.length >= queryParams.total || isLoadingMore"
          :class="[
            'px-4 py-2 font-semibold text-xs sm:text-sm rounded-lg border transition-colors w-full sm:w-auto',
            rows.length >= queryParams.total || isLoadingMore
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-gray-50 hover:border-gray-400 shadow-xs shadow-[#1018280D] cursor-pointer',
          ]"
        >
          {{ isLoadingMore ? "Loading..." : "Load More" }}
        </button>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 bg-white rounded-lg border border-[#E9EAEB]"
    >
      <p class="text-gray-600 text-base sm:text-lg font-medium text-center">
        No referral code has been created
      </p>
      <p class="text-gray-400 text-xs sm:text-sm mt-2 text-center">
        There are no referral records to display at the moment.
      </p>
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

  <IndexModal :is-open="openRef" @toggle-popup="openRef = false">
    <template #content>
      <PagesSettingsReferralLinks :refDetail="refDetail" />
    </template>
  </IndexModal>
</template>

<script setup>
import { ref, reactive, onMounted, watch, markRaw } from "vue";
import debounce from "lodash/debounce";
import moment from "moment";
import { toast } from "vue3-toastify";
import AppStatusButton from "~/components/AppStatusButton.vue";
import DeleteModal from "~/components/DeleteModal.vue";
import EditIcon from "~/assets/images/icon/EditIcon.vue";
import SuspendIcon from "~/assets/images/icon/SuspendIcon.vue";
import ReactivateIcon from "~/assets/images/icon/ReactivateIcon.vue";
import DeleteIcon from "~/assets/images/icon/DeleteIcon.vue";
import {
  getReferrals,
  updateReferralStatus,
  deleteReferral,
} from "~/services/userservices";

const searchQuery = ref("");
const isLoading = ref(false);
const isLoadingMore = ref(false);
const deleteModalOpen = ref(false);
const deleteLoading = ref(false);
const openRef = ref(false);
const refDetail = ref(null);
const selectedReferralForDelete = ref(null);

const filters = ref({
  status: "all",
});

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

const rows = ref([]);

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "0" },
  { label: "Inactive", value: "1" },
];

const columns = [
  { field: "referralCode", header: "Referral Code" },
  { field: "assignedUser", header: "Assigned User" },
  { field: "assignedDepartment", header: "Department" },
  { field: "assignedApps", header: "Assigned Apps" },
  { field: "created_On", header: "Created" },
  { field: "status", header: "Status" },
];

const actions = [
  {
    key: "edit",
    label: "Edit Referral code",
    icon: markRaw(EditIcon),
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
  },
  {
    key: "activate",
    label: "Activate Code",
    icon: markRaw(ReactivateIcon),
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
    condition: (data) => data.status === 1,
  },
  {
    key: "deactivate",
    label: "Deactivate Code",
    icon: markRaw(SuspendIcon),
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
    condition: (data) => data.status !== 1,
  },
  {
    key: "delete",
    label: "Delete code",
    icon: markRaw(DeleteIcon),
    iconColor: "text-[#D92D20]",
    textColor: "text-[#D92D20]",
  },
];

const formatDate = (value) => (value ? moment(value).format("lll") : "-");

const fetchReferrals = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    const payload = {
      ...queryParams,
      status: queryParams.status === "" ? "" : Number(queryParams.status),
    };
    const res = await getReferrals(payload);
    const newRows = res?.data?.data || [];

    rows.value = isLoadMore ? [...rows.value, ...newRows] : newRows;
    queryParams.total = res?.data?.totalCount || 0;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to fetch referrals",
    );
  } finally {
    if (isLoadMore) {
      isLoadingMore.value = false;
    } else {
      isLoading.value = false;
    }
  }
};

const debounceSearch = debounce(() => {
  queryParams.PageNumber = 1;
  fetchReferrals(false);
}, 800);

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleFilterChange = () => {
};

const handleDownload = () => {
  const csvColumns = [
    { header: "Referral Code", key: "referralCode" },
    { header: "Assigned User", key: "assignedUser" },
    { header: "Department", key: "assignedDepartment" },
    { header: "Assigned Apps", key: "assignedApps" },
    { header: "Created", key: "created_On" },
    { header: "Status", key: "status" },
  ];

  const dataToExport = rows.value.map((item) => ({
    ...item,
    created_On: formatDate(item.created_On),
    status: item.status === 1 ? "Inactive" : "Active",
  }));

  exportToCSV(
    dataToExport,
    csvColumns,
    `referral-management-${moment().format("YYYY-MM-DD")}`,
  );
};

const handleLoadMore = () => {
  queryParams.PageNumber += 1;
  fetchReferrals(true);
};

const openReferralLinks = (row) => {
  refDetail.value = row;
  openRef.value = true;
};

const handleEdit = (row) => {
  navigateTo(`/referral-management/edit/${row.referralCode}`);
};

const handleActivate = async (row) => {
  try {
    await updateReferralStatus(row.referralCode, 1);
    toast.success("Referral code activated successfully");
    fetchReferrals(false);
  } catch (error) {
    console.error("Error activating referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to activate referral code",
    );
  }
};

const handleDeactivate = async (row) => {
  try {
    await updateReferralStatus(row.referralCode, 0);
    toast.success("Referral code deactivated successfully");
    fetchReferrals(false);
  } catch (error) {
    console.error("Error deactivating referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to deactivate referral code",
    );
  }
};

const handleDelete = (row) => {
  selectedReferralForDelete.value = row;
  deleteModalOpen.value = true;
};

const handleAction = (action, row) => {
  if (action === "edit") {
    handleEdit(row);
    return;
  }

  if (action === "activate") {
    handleActivate(row);
    return;
  }

  if (action === "deactivate") {
    handleDeactivate(row);
    return;
  }

  if (action === "delete") {
    handleDelete(row);
  }
};

const confirmDelete = async () => {
  if (!selectedReferralForDelete.value?.id) return;

  try {
    deleteLoading.value = true;
    await deleteReferral(selectedReferralForDelete.value.id);
    toast.success("Referral code deleted successfully");
    deleteModalOpen.value = false;
    fetchReferrals(false);
  } catch (error) {
    console.error("Error deleting referral:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to delete referral code",
    );
  } finally {
    deleteLoading.value = false;
  }
};

watch(
  () => searchQuery.value,
  (value) => {
    queryParams.ReferralCode = value;
    debounceSearch();
  },
);

watch(
  () => filters.value.status,
  (value) => {
    queryParams.status = value === "all" ? "" : value;
    queryParams.PageNumber = 1;
    fetchReferrals(false);
  },
);

onMounted(() => {
  fetchReferrals(false);
});
</script>

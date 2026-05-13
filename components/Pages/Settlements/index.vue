<template>
  <div class="font-Avenir overflow-visible max-w-[1120px] mx-auto px-4 py-4">
    <div class="pt-6">
      <DashboardPageHeader
        title="Settlement Accounts"
        subtitle="Manage the account where your funds will be paid into."
      >
        <template #right>
          <button
            v-if="canManageSettlements"
            @click="openCreateModal"
            class="px-3 sm:px-4 py-2 bg-[#1570EF] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Settlement Account
          </button>
        </template>
      </DashboardPageHeader>
    </div>

    <DashboardTableFilters
      v-model="searchQuery"
      search-placeholder="Search settlement accounts"
      :show-download="false"
      @search="handleSearch"
    />

      <div
        v-if="filteredRows.length > 0 || isLoading"
        class="bg-white rounded-lg border border-[#E4E7EC] overflow-visible"
      >
      <div class="overflow-x-auto">
        <DashboardDataTable
          :columns="columns"
          :data="filteredRows"
          :loading="isLoading"
          :show-actions="canManageSettlements"
          :actions="actions"
          :paginator="false"
          body-cell-class="px-6 py-4 text-sm font-medium text-[#475467]"
          empty-message="No settlement account available"
          @action="handleAction"
        >
          <template #cell-accountName="slotProps">
            <div class="flex items-center gap-2">
              <span class="text-[#101828]">{{
                slotProps.data.accountName || "-"
              }}</span>
              <span
                v-if="slotProps.data.isPrimaryAccount"
                class="bg-[#F2F4F7] text-[#344054] text-xs font-medium px-2 py-0.5 rounded"
              >
                Primary
              </span>
            </div>
          </template>

          <template #cell-accountNumber="slotProps">
            <span :class="slotProps.data.status == 3 ? 'opacity-40' : ''">
              {{ slotProps.data.accountNumber || "-" }}
            </span>
          </template>

          <template #cell-bankName="slotProps">
            <span>{{ slotProps.data.bankName || "-" }}</span>
          </template>
        </DashboardDataTable>
      </div>

      <div
        class="flex flex-col sm:flex-row relative justify-center items-center gap-3 sm:gap-0 py-3 sm:py-4 px-4 sm:px-6 border-t border-[#F2F4F7]"
      >
        <div
          class="text-xs sm:text-sm text-[#344054] sm:absolute sm:left-6 font-medium"
        >
          {{ filteredRows.length === 0 ? 0 : 1 }} - {{ filteredRows.length }}
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
        No settlement account available
      </p>
      <p class="text-gray-400 text-xs sm:text-sm mt-2 text-center">
        Add a settlement account to receive payouts.
      </p>
      <button
        v-if="canManageSettlements"
        @click="openCreateModal"
        class="mt-5 px-4 py-2 bg-[#1570EF] text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        Add Settlement Account
      </button>
    </div>

    <div
      v-if="canManageSettlements"
      class="mt-5 bg-white rounded-lg border border-[#E4E7EC] px-4 py-4 sm:px-6"
    >
      <div class="flex items-center justify-start gap-x-3">
        <span class="text-sm font-medium text-[#344054]">
          {{
            `${isAutoSettlement ? "Deactivate" : "Activate"} auto settlement`
          }}
        </span>
        <button
          type="button"
          @click="toggleAutoSettlement"
          :class="[
            isAutoSettlement ? 'bg-[#1570EF]' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
          ]"
        >
          <span
            :class="[
              isAutoSettlement ? 'translate-x-6' : 'translate-x-1',
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            ]"
          />
        </button>
        <AppIcon
          v-if="setLoader"
          icon="fa:spinner"
          iconClass="fa-spin text-[#667085]"
        />
      </div>
    </div>
  </div>

  <DeleteModal
    @deleteItem="handleDelete"
    @close="deleteModalOpen = false"
    title="Delete account"
    text="Are you sure you want to delete this account? This action cannot be undone."
    :open="deleteModalOpen"
    :loading="deleteLoading"
    btnText="Yes, Delete"
  />

  <IndexModal
    :isOpen="isModalOpen"
    @togglePopup="isModalOpen = false"
    v-if="isModalOpen"
  >
    <template #content>
      <div class="h-full w-full bg-white rounded-lg p-6">
        <PagesSettlementsForm
          :id="selectedId"
          :detail="selectedDetail"
          @refresh="refreshAfterSave"
        />
      </div>
    </template>
  </IndexModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, provide } from "vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import AppIcon from "~/components/AppIcon";
import EditIcon from "~/assets/images/icon/EditIcon.vue";
import DeleteIcon from "~/assets/images/icon/DeleteIcon.vue";
import {
  viewSettlement,
  deleteSettlement,
  autoSettlement,
  getAutoSettlement,
} from "~/services/settlementservice";

const authStore = useAuthStore();

const canManageSettlements = computed(
  () => authStore?.userInfo?.userCategory === 1,
);

const searchQuery = ref("");
const isLoading = ref(false);
const isLoadingMore = ref(false);
const setLoader = ref(false);
const isAutoSettlement = ref(false);

const deleteModalOpen = ref(false);
const deleteLoading = ref(false);
const selectedId = ref<number | null>(null);
const selectedDetail = ref<any>(null);
const isModalOpen = ref(false);

const rows = ref<any[]>([]);

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  Type: "",
  total: 0,
});

const columns = [
  { field: "accountName", header: "Account name" },
  { field: "accountNumber", header: "Account number" },
  { field: "bankName", header: "Bank" },
];

const actions = [
  {
    key: "edit",
    label: "Edit account",
    icon: EditIcon,
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
  },
  {
    key: "delete",
    label: "Delete",
    icon: DeleteIcon,
    iconColor: "text-[#D92D20]",
    textColor: "text-[#D92D20]",
  },
];

const filteredRows = computed(() => {
  if (!queryParams.Search) return rows.value;
  const search = queryParams.Search.toLowerCase();
  return rows.value.filter((item: any) => {
    const accountName = (item.accountName || "").toLowerCase();
    const accountNumber = (item.accountNumber || "").toLowerCase();
    const bankName = (item.bankName || "").toLowerCase();
    return (
      accountName.includes(search) ||
      accountNumber.includes(search) ||
      bankName.includes(search)
    );
  });
});

const mergeUniqueById = (existing: any[], incoming: any[]) => {
  const map = new Map<string, any>();
  [...existing, ...incoming].forEach((item) => {
    map.set(String(item.id ?? `${item.accountNumber}-${item.bankName}`), item);
  });
  return Array.from(map.values());
};

const getSettlement = async () => {
  setLoader.value = true;
  try {
    const res = await getAutoSettlement();
    if (res.status === 200) {
      isAutoSettlement.value = !!res.data?.data?.autoSettlement;
    }
  } catch {
    // silent fail
  } finally {
    setLoader.value = false;
  }
};

const getFinanceData = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    const res: any = await viewSettlement(queryParams as any);
    const fetchedRows = Array.isArray(res?.data?.data) ? res.data.data : [];

    rows.value = isLoadMore
      ? mergeUniqueById(rows.value, fetchedRows)
      : fetchedRows;
    queryParams.total = res?.data?.totalCount || rows.value.length;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to fetch settlement accounts",
    );
  } finally {
    if (isLoadMore) {
      isLoadingMore.value = false;
    } else {
      isLoading.value = false;
    }
  }
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const debounceSearch = debounce(() => {
  queryParams.Search = searchQuery.value;
}, 300);

const handleLoadMore = () => {
  if (rows.value.length >= queryParams.total) return;
  queryParams.PageNumber += 1;
  getFinanceData(true);
};

const openCreateModal = () => {
  selectedId.value = null;
  selectedDetail.value = null;
  isModalOpen.value = true;
};

const handleAction = (action: string, row: any) => {
  if (action === "edit") {
    selectedId.value = row?.id || null;
    selectedDetail.value = row;
    isModalOpen.value = true;
    return;
  }

  if (action === "delete") {
    selectedId.value = row?.id || null;
    deleteModalOpen.value = true;
  }
};

const handleDelete = async () => {
  if (!selectedId.value) return;

  try {
    deleteLoading.value = true;
    await deleteSettlement(selectedId.value);
    toast.success("Settlement account deleted successfully");
    deleteModalOpen.value = false;
    await getFinanceData(false);
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Account deletion failed",
    );
  } finally {
    deleteLoading.value = false;
  }
};

const refreshAfterSave = async () => {
  isModalOpen.value = false;
  await getFinanceData(false);
};

const toggleAutoSettlement = async () => {
  if (setLoader.value) return;
  setLoader.value = true;

  const nextValue = !isAutoSettlement.value;
  try {
    await autoSettlement({ autoSettlement: nextValue });
    isAutoSettlement.value = nextValue;
    toast.success(`Auto settlement ${nextValue ? "activated" : "deactivated"}`);
  } catch {
    toast.error("Failed to update auto settlement setting");
  } finally {
    setLoader.value = false;
  }
};

provide("handleSuccess", refreshAfterSave);
provide("isOpen", isModalOpen);

onMounted(async () => {
  await Promise.all([getSettlement(), getFinanceData(false)]);
});

watch(
  () => searchQuery.value,
  () => {
    debounceSearch();
  },
);
</script>

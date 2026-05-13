<template>
  <div class="font-Avenir overflow-hidden" :class="customClass">
    <AppTab :tabs="tabs" :active="activeTab" @set-active="handleTabChange" />

    <DashboardPageHeader
      v-if="!hideHeader"
      title="Referral Leaderboard"
      subtitle="Track top performers and see who leads the referral rankings."
    />

    <DashboardTableFilters
      v-model="searchQuery"
      search-placeholder="Search leaderboard"
      @search="handleSearch"
      @download="handleDownload"
    >
      <template #filters>
        <DashboardDateRangePicker
          v-model="filters.dateRange"
          placeholder="Date Range"
          @change="handleDateChange"
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
          :paginator="false"
          body-cell-class="px-6 py-4 text-sm font-medium text-[#475467]"
          empty-message="No leaderboard data available"
        />
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
        No leaderboard data available
      </p>
      <p class="text-gray-400 text-xs sm:text-sm mt-2 text-center">
        There are no referral records to display at the moment.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import moment from "moment";
import { getReferralLeaderboard } from "~/services/userservices";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

defineProps({
  customClass: {
    type: String,
    default: "py-10",
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
});

const tabs = [
  { title: "Users", key: "user" },
  { title: "Campaigns", key: "campaign" },
];

const refTypes: Record<string, number[]> = {
  user: [0],
  department: [1],
  campaign: [2],
};

const activeTab = ref("user");
const searchQuery = ref("");
const isLoading = ref(false);
const isLoadingMore = ref(false);
const isExporting = ref(false);
const rows = ref<any[]>([]);

const filters = ref({
  dateRange: null as DateRange | null,
});

const columns = [
  { field: "rank", header: "Rank" },
  { field: "userName", header: "Name" },
  { field: "totalReferrals", header: "Total referrals" },
  { field: "matta", header: "Matta" },
  { field: "orbital", header: "Orbital" },
  { field: "oxide", header: "Oxide" },
  { field: "flux", header: "Flux" },
];

const queryParams = reactive({
  search: "",
  PageNumber: 1,
  PageSize: 10,
  status: "",
  total: 0,
  from: null as string | null,
  to: null as string | null,
});

const fetchReferrals = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    const res: any = await getReferralLeaderboard({
      ...queryParams,
      referalTypes: refTypes[activeTab.value],
    });

    const newRows = res?.data?.data || [];
    rows.value = isLoadMore ? [...rows.value, ...newRows] : newRows;
    queryParams.total = res?.data?.totalCount || 0;
  } catch (error: any) {
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

const handleTabChange = (value: string) => {
  activeTab.value = value;
  queryParams.PageNumber = 1;
  fetchReferrals(false);
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleDateChange = (range: DateRange | null) => {
  filters.value.dateRange = range;
};

const handleLoadMore = () => {
  queryParams.PageNumber += 1;
  fetchReferrals(true);
};

const handleDownload = async () => {
  if (rows.value.length === 0) {
    toast.error("No data to export");
    return;
  }

  isExporting.value = true;
  try {
    const csvColumns = [
      { header: "Rank", key: "rank" },
      { header: "User Name", key: "userName" },
      { header: "Orbital Onboards", key: "orbital" },
      { header: "Flux Onboards", key: "flux" },
      { header: "Matta Onboards", key: "matta" },
      { header: "Oxide Onboards", key: "oxide" },
      { header: "Total Onboarded Customers", key: "totalReferrals" },
    ];

    const today = moment().format("YYYY-MM-DD");
    const fileName = `Referral_Leaderboard_${today}`;
    exportToCSV(rows.value, csvColumns, fileName);
    toast.success("Leaderboard data exported successfully");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    toast.error("Failed to export leaderboard data");
  } finally {
    isExporting.value = false;
  }
};

watch(
  () => searchQuery.value,
  (value) => {
    queryParams.search = value;
    debounceSearch();
  },
);

watch(
  () => filters.value.dateRange,
  (range) => {
    if (range?.start && range?.end) {
      queryParams.from = moment(range.start).format("YYYY-MM-DD");
      queryParams.to = moment(range.end).format("YYYY-MM-DD");
    } else {
      queryParams.from = null;
      queryParams.to = null;
    }

    queryParams.PageNumber = 1;
    fetchReferrals(false);
  },
  { deep: true },
);

onMounted(() => {
  fetchReferrals(false);
});
</script>

<template>
  <div class="font-Avenir">
    <!-- Page Header -->
    <DashboardPageHeader
      title="Audit Logs"
      subtitle="Track all activities and actions across your applications."
    />

    <!-- Table Filters -->
    <DashboardTableFilters
      v-model="searchQuery"
      search-placeholder="Search Logs"
      @search="handleSearch"
      @download="handleDownload"
    >
      <template #filters>
        <DashboardFilterDropdown
          v-model="filters.app"
          :options="appOptions"
          placeholder="App"
          @change="handleFilterChange"
        />
        <DashboardDateRangePicker
          v-model="filters.dateRange"
          placeholder="Date Range"
          @change="handleDateChange"
        />
      </template>
    </DashboardTableFilters>

    <!-- Data Table with Pagination -->
    <div v-if="filteredLogs.length > 0 || isLoading" class="bg-white rounded-lg border border-[#E4E7EC]">
      <DashboardDataTable
        :columns="columns"
        :data="filteredLogs"
        :loading="isLoading"
        :show-actions="true"
        :actions="actions"
        :paginator="false"
        empty-message="No logs found"
        @action="handleAction"
      />

      <!-- Pagination Footer -->
      <div class="flex relative justify-center items-center py-4 px-6 border-t border-[#F2F4F7]">
        <div class="text-sm text-[#344054] absolute left-6 font-medium mr-auto">
          {{ 1 }} - {{ logs.length }}
        </div>
        <button
          @click="handleLoadMore"
          :disabled="logs.length >= queryParams.total || isLoadingMore"
          :class="[
            'px-4 py-2 font-semibold text-sm rounded-lg border transition-colors',
            logs.length >= queryParams.total || isLoadingMore
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-gray-50 hover:border-gray-400 shadow-xs shadow-[#1018280D] cursor-pointer'
          ]"
        >
          {{ isLoadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-[#E9EAEB]"
    >
      <p class="text-gray-600 text-lg font-medium">No audit logs found</p>
      <p class="text-gray-400 text-sm mt-2">
        There are no logs to display at the moment.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import debounce from "lodash/debounce";
import { getOwnerAudit, getAdminAudit } from "~/services/auditservice";
import moment from "moment";
import { exportToCSV } from "~/utils/exportCsv";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const authStore = useAuthStore();
const searchQuery = ref("");
const isLoading = ref(false);
const isLoadingMore = ref(false);

const filters = ref({
  app: null as string | null,
  dateRange: null as DateRange | null,
});

const appOptions = computed(() => {
  return (
    authStore?.appList?.map((app: any) => ({
      label: app.name,
      value: app.appCode,
    })) || []
  );
});

// Table columns
const columns = [
  { field: "userName", header: "User" },
  { field: "role", header: "Role" },
  { field: "app", header: "App" },
  { field: "activity", header: "Action" },
  { field: "lastActive", header: "Last Seen" },
];

const actions = [{ key: "view", label: "View Details" }];

// API query parameters
const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  BusinessId: "",
  userId: "",
  total: 0,
});

// Audit data
const logs = ref([]);

// Audit service mapper based on user category
const GetAudit = {
  0: getAdminAudit,
  1: getOwnerAudit,
  3: getAdminAudit,
  4: getAdminAudit,
};

// Fetch audit data from API
function getAuditData(isLoadMore: boolean = false) {
  if (isLoadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }

  GetAudit[authStore.userInfo.userCategory](queryParams)
    .then((res: any) => {
      const newLogs = res.data.data.map((item: any) => ({
        ...item,
        lastActive: moment(item.created).format("lll"),
        app: authStore.appList.find((j: any) => j.appCode === item.appCode)
          ?.name,
      }));

      // If loading more, append to existing logs; otherwise, replace
      if (isLoadMore) {
        logs.value = [...logs.value, ...newLogs];
      } else {
        logs.value = newLogs;
      }

      queryParams.total = res.data.totalCount;

      if (isLoadMore) {
        isLoadingMore.value = false;
      } else {
        isLoading.value = false;
      }
    })
    .catch(() => {
      if (isLoadMore) {
        isLoadingMore.value = false;
      } else {
        isLoading.value = false;
      }
    });
}

// Filtered logs based on search and filters
const filteredLogs = computed(() => {
  let result = logs.value;

  if (filters.value.app) {
    result = result.filter((log: any) => log.appCode === filters.value.app);
  }

  if (filters.value.dateRange?.start && filters.value.dateRange?.end) {
    result = result.filter((log: any) => {
      const logDate = new Date(log.created);
      return (
        logDate >= filters.value.dateRange!.start! &&
        logDate <= filters.value.dateRange!.end!
      );
    });
  }

  return result;
});

// Load initial data
onMounted(() => {
  getAuditData();
});

// Debounced search
const debounceSearch = debounce(() => {
  queryParams.PageNumber = 1;
  getAuditData();
}, 800);

// Watch for search query changes
watch(
  () => searchQuery.value,
  (newQuery) => {
    queryParams.Search = newQuery;
    debounceSearch();
  }
);

// Watch for filter changes
watch(
  () => [filters.value.app, filters.value.dateRange],
  () => {
    queryParams.PageNumber = 1;
  },
  { deep: true }
);

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleDownload = () => {
  const dataToExport = filteredLogs.value.map(log => ({
    userName: log.userName,
    role: log.role,
    app: log.app,
    activity: log.activity,
    lastActive: log.lastActive,
  }));

  exportToCSV(dataToExport, columns, `audit-logs-${moment().format('YYYY-MM-DD')}`);
};

const handleFilterChange = () => {
  console.log("Filters changed:", filters.value);
};

const handleDateChange = (range: DateRange | null) => {
  filters.value.dateRange = range;
};

const handleAction = (action: string, data: any, index: number) => {
  console.log("Action:", action, "Data:", data, "Index:", index);
};

const handleLoadMore = () => {
  // Increment page number and fetch next page, appending to existing results
  queryParams.PageNumber++;
  getAuditData(true);
};
</script>

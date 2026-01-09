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

    <!-- Data Table -->
    <div v-if="filteredLogs.length > 0 || isLoading">
      <DashboardDataTable
        :columns="columns"
        :data="filteredLogs"
        :loading="isLoading"
        :show-actions="true"
        :actions="actions"
        empty-message="No logs found"
        @action="handleAction"
      />
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

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const authStore = useAuthStore();
const searchQuery = ref("");
const isLoading = ref(false);

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
function getAuditData() {
  isLoading.value = true;
  GetAudit[authStore.userInfo.userCategory](queryParams)
    .then((res: any) => {
      logs.value = res.data.data.map((item: any) => ({
        ...item,
        lastActive: moment(item.created).format("lll"),
        app: authStore.appList.find((j: any) => j.appCode === item.appCode)
          ?.name,
      }));
      queryParams.total = res.data.totalCount;
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
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

// Watch for pagination changes
watch(
  () => queryParams.PageNumber,
  () => {
    getAuditData();
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
  console.log("Download clicked");
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
</script>

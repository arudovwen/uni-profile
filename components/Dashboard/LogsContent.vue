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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const searchQuery = ref("");
const isLoading = ref(false);

const filters = ref({
  app: null as string | null,
  dateRange: null as DateRange | null,
});

const appOptions = [
  { label: "Flux Pro", value: "FLU722" },
  { label: "Orbital Pro", value: "ORB789" },
  { label: "Oxide Pro", value: "OXP975" },
  { label: "Polymer Pro", value: "POL766" },
];

// Table columns
const columns = [
  { field: "user", header: "User" },
  { field: "role", header: "Role" },
  { field: "app", header: "App" },
  { field: "action", header: "Action" },
  { field: "timestamp", header: "Last Seen" },
];

const actions = [{ key: "view", label: "View Details" }];

// Sample data
const logs = ref([
  {
    id: 1,
    user: "Adeleke Laketu",
    email: "sodlak007@gmail.com",
    role: "Admin",
    app: "Oxide Pro",
    action: "Invited New User",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
  {
    id: 2,
    user: "Wade Warren",
    email: "deanna.curtis@example.com",
    role: "Owner",
    app: "Orbital Pro",
    action: "Reset Password",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
  {
    id: 3,
    user: "Cameron Williamson",
    email: "willie.jennings@example.com",
    role: "Super Admin",
    app: "Flux Pro",
    action: "Approved Transaction",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
  {
    id: 4,
    user: "Ralph Edwards",
    email: "sara.cruz@example.com",
    role: "Admin",
    app: "Polymer Pro",
    action: "Logged In",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
  {
    id: 5,
    user: "Jacob Jones",
    email: "georgia.young@example.com",
    role: "Admin",
    app: "Orbital Pro",
    action: "Invited New User",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
  {
    id: 6,
    user: "Annette Black",
    email: "felicia.reid@example.com",
    role: "Admin",
    app: "Orbital Pro",
    action: "Approved Transaction",
    timestamp: "Dec 6, 2025 11:52 PM",
  },
]);

// Filtered logs based on search and filters
const filteredLogs = computed(() => {
  let result = logs.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (log) =>
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
    );
  }

  if (filters.value.app) {
    const appName =
      appOptions.find((a) => a.value === filters.value.app)?.label || "";
    result = result.filter((log) => log.app === appName);
  }

  if (filters.value.dateRange?.start && filters.value.dateRange?.end) {
    // Date filtering would go here
  }

  return result;
});

const handleSearch = (query: string) => {
  console.log("Search:", query);
};

const handleDownload = () => {
  console.log("Download clicked");
};

const handleFilterChange = () => {
  console.log("Filters changed:", filters.value);
};

const handleDateChange = (range: DateRange | null) => {
  console.log("Date range changed:", range);
};

const handleAction = (action: string, data: any, index: number) => {
  console.log("Action:", action, "Data:", data, "Index:", index);
};
</script>

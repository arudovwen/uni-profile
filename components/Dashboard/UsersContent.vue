<template>
  <div class="font-Avenir">
    <!-- Page Header -->
    <DashboardPageHeader
      title="Users"
      subtitle="Manage the users in your network and their permissions."
    />

    <!-- Table Filters -->
    <DashboardTableFilters
      v-model="searchQuery"
      search-placeholder="Search Users"
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
        <DashboardFilterDropdown
          v-model="filters.role"
          :options="roleOptions"
          placeholder="Role"
          @change="handleFilterChange"
        />
      </template>
    </DashboardTableFilters>

    <!-- Data Table -->
    <DashboardDataTable
      :columns="columns"
      :data="filteredUsers"
      :loading="isLoading"
      :show-actions="true"
      :actions="actions"
      empty-message="No users found"
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchQuery = ref("");
const isLoading = ref(false);

const filters = ref({
  app: null as string | null,
  role: null as string | null,
});

const appOptions = [
  { label: "Flux Pro", value: "FLU722" },
  { label: "Orbital Pro", value: "ORB789" },
  { label: "Oxide Pro", value: "OXP975" },
  { label: "Polymer Pro", value: "POL766" },
];

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Owner", value: "Owner" },
  { label: "Super Admin", value: "Super Admin" },
  { label: "User", value: "User" },
];

// Table columns
const columns = [
  { field: "name", header: "User" },
  { field: "role", header: "Role" },
  { field: "app", header: "App" },
  { field: "lastSeen", header: "Last Seen" },
  { field: "status", header: "Status" },
];

const actions = [
  { key: "view", label: "View Details" },
  { key: "edit", label: "Edit User" },
  { key: "remove", label: "Remove User" },
];

// Sample data
const users = ref([
  {
    id: 1,
    name: "Adeleke Laketu",
    email: "sodlak007@gmail.com",
    role: "Admin",
    app: "Oxide Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Active",
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "deanna.curtis@example.com",
    role: "Owner",
    app: "Orbital Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Pending",
  },
  {
    id: 3,
    name: "Cameron Williamson",
    email: "willie.jennings@example.com",
    role: "Super Admin",
    app: "Flux Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Active",
  },
  {
    id: 4,
    name: "Ralph Edwards",
    email: "sara.cruz@example.com",
    role: "Admin",
    app: "Polymer Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Pending",
  },
  {
    id: 5,
    name: "Jacob Jones",
    email: "georgia.young@example.com",
    role: "Admin",
    app: "Orbital Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Annette Black",
    email: "felicia.reid@example.com",
    role: "Admin",
    app: "Orbital Pro",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Pending",
  },
]);

// Filtered users based on search and filters
const filteredUsers = computed(() => {
  let result = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  if (filters.value.app) {
    const appName =
      appOptions.find((a) => a.value === filters.value.app)?.label || "";
    result = result.filter((user) => user.app === appName);
  }

  if (filters.value.role) {
    result = result.filter((user) => user.role === filters.value.role);
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

const handleAction = (action: string, data: any, index: number) => {
  console.log("Action:", action, "Data:", data, "Index:", index);
};
</script>

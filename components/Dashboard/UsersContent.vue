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
          v-model="filters.role"
          :options="roleOptions"
          placeholder="Role"
          @change="handleFilterChange"
        />
        <DashboardFilterDropdown
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Status"
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
import { ref, computed, markRaw } from "vue";
import SuspendIcon from "~/assets/images/icon/SuspendIcon.vue";
import ReactivateIcon from "~/assets/images/icon/ReactivateIcon.vue";
import DeleteIcon from "~/assets/images/icon/DeleteIcon.vue";

const searchQuery = ref("");
const isLoading = ref(false);

const filters = ref({
  role: null as string | null,
  status: null as string | null,
});

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Platform User", value: "Platform User" },
  { label: "Member", value: "Member" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending Invite", value: "Pending Invite" },
];

// Table columns
const columns = [
  { field: "user", header: "User" },
  { field: "role", header: "Role" },
  { field: "joined", header: "Joined" },
  { field: "lastSeen", header: "Last Seen" },
  { field: "status", header: "Status" },
];

const actions = [
  {
    key: "suspend",
    label: "Suspend User",
    icon: markRaw(SuspendIcon),
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
  },
  {
    key: "reactivate",
    label: "Reactivate User",
    icon: markRaw(ReactivateIcon),
    iconColor: "text-[#667085]",
    textColor: "text-[#344054]",
  },
  {
    key: "delete",
    label: "Delete User",
    icon: markRaw(DeleteIcon),
    iconColor: "text-[#D92D20]",
    textColor: "text-[#D92D20]",
  },
];

// Sample data
const users = ref([
  {
    id: 1,
    user: "Adeleke Laketu",
    email: "sodlak007@gmail.com",
    avatar: "",
    role: "Admin",
    joined: "Dec 1, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Active",
  },
  {
    id: 2,
    user: "Wade Warren",
    email: "deanna.curtis@example.com",
    avatar: "",
    role: "Platform User",
    joined: "Nov 15, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Pending Invite",
  },
  {
    id: 3,
    user: "Cameron Williamson",
    email: "willie.jennings@example.com",
    avatar: "",
    role: "Admin",
    joined: "Oct 20, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Active",
  },
  {
    id: 4,
    user: "Ralph Edwards",
    email: "sara.cruz@example.com",
    avatar: "",
    role: "Member",
    joined: "Sep 10, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Inactive",
  },
  {
    id: 5,
    user: "Jacob Jones",
    email: "georgia.young@example.com",
    avatar: "",
    role: "Platform User",
    joined: "Aug 5, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Active",
  },
  {
    id: 6,
    user: "Annette Black",
    email: "felicia.reid@example.com",
    avatar: "",
    role: "Member",
    joined: "Jul 22, 2025",
    lastSeen: "Dec 6, 2025 11:52 PM",
    status: "Pending Invite",
  },
]);

// Filtered users based on search and filters
const filteredUsers = computed(() => {
  let result = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.user.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  if (filters.value.role) {
    result = result.filter((user) => user.role === filters.value.role);
  }

  if (filters.value.status && filters.value.status !== "all") {
    result = result.filter((user) => user.status === filters.value.status);
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

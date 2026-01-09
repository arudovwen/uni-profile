<template>
  <div class="font-Avenir">
    <!-- Page Header -->
    <DashboardPageHeader
      title="Users"
      subtitle="Manage the users in your network and their permissions."
    >
      <template #right>
        <button
          @click="handleInviteUser"
          class="px-4 py-2 bg-[#1570EF] text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Invite User
        </button>
      </template>
    </DashboardPageHeader>

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
    <div v-if="filteredUsers.length > 0 || isLoading">
      <DashboardDataTable
        :columns="columns"
        :data="filteredUsers"
        :loading="isLoading"
        :show-actions="true"
        :actions="actions"
        :paginator="true"
        :rows="queryParams.PageSize"
        :totalRecords="queryParams.total"
        :lazy="true"
        empty-message="No users found"
        @action="handleAction"
        @page="handlePageChange"
      >
        <template #cell-user="slotProps">
          <div class="flex flex-row gap-3">
            <div
              :class="`h-8 w-8 rounded-[50%] ${
                slotProps.data.photoUrl ? 'bg-[#ababab]' : 'bg-primary-600'
              } flex items-center justify-center flex-shrink-0 overflow-hidden`"
            >
              <img
                v-if="slotProps.data.photoUrl"
                :src="slotProps.data.photoUrl"
                :alt="slotProps.data.user"
                class="w-full h-full object-cover"
              />
              <span
                v-else
                class="text-white text-xs flex justify-center items-center font-semibold"
              >
                {{ getUserInitials(slotProps.data.user) }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-[#2F2F2F]">{{
                slotProps.data.user
              }}</span>
              <span class="text-sm text-[#667085]">{{
                slotProps.data.email
              }}</span>
            </div>
          </div>
        </template>
      </DashboardDataTable>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-[#E9EAEB]"
    >
      <img
        src="@/assets/images/empty-users.png"
        alt="No users"
        class="w-32 h-32 mb-4"
      />
      <p class="text-gray-600 text-lg font-medium">No users found</p>
      <p class="text-gray-400 text-sm mt-2">
        There are no users to display at the moment.
      </p>
    </div>

    <!-- Confirmation Modal -->
    <ActionModal
      @actionItem="confirmActionHandler"
      @close="confirmModal.open = false"
      :title="
        confirmModal.action === 'suspend' ? 'Suspend User' : 'Reactivate User'
      "
      :text="`Are you sure you want to ${confirmModal.action} ${confirmModal.user?.user}?`"
      :open="confirmModal.open"
      :btnText="`Yes, ${
        confirmModal.action === 'suspend' ? 'Suspend' : 'Reactivate'
      }`"
      :loading="actionLoading"
    />

    <!-- Invite Users Modal -->
    <InviteUsersModal
      :isOpen="inviteModal.isOpen"
      @close="inviteModal.isOpen = false"
      @invite="handleInviteSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, markRaw } from "vue";
import debounce from "lodash/debounce";
import moment from "moment";
import { getAllUsers, toggleUserStatus } from "~/services/userservices";
import { useToast } from "~/composables/useToast";
import SuspendIcon from "~/assets/images/icon/SuspendIcon.vue";
import ReactivateIcon from "~/assets/images/icon/ReactivateIcon.vue";
import DeleteIcon from "~/assets/images/icon/DeleteIcon.vue";
import InviteUsersModal from "~/components/InviteUsersModal.vue";

const searchQuery = ref("");
const isLoading = ref(false);
const toast = useToast();

const filters = ref({
  role: null as string | null,
  status: null as string | null,
});

// API query parameters
const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 15,
  userCategories: [0, 1, 2, 3, 4], // Show all users
  total: 0,
});

// State for users and actions
const users = ref<any[]>([]);
const actionLoading = ref(false);
const confirmModal = ref({
  open: false,
  action: null as string | null,
  user: null as any,
});

const inviteModal = ref({
  isOpen: false,
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

// Helper function to map userCategory to role name
const getRoleName = (category: number): string => {
  const roleMap: Record<number, string> = {
    0: "Admin",
    1: "Member",
    2: "Member",
    3: "Admin",
    4: "Platform User",
  };
  return roleMap[category] || "Unknown";
};

// Helper function to get user initials
const getUserInitials = (fullName: string): string => {
  if (!fullName) return "U";
  const names = fullName.trim().split(/\s+/);
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

// Fetch users from API
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await getAllUsers(queryParams);
    users.value = res.data.data.map((user: any) => ({
      id: user.id,
      user: `${user.firstName} ${user.lastName}`,
      email: user.contactEmail,
      role: user.category,
      joined: user.created ? moment(user.created).format("MMM D, YYYY") : "-",
      lastSeen: user.lastLoginTime
        ? moment(user.lastLoginTime).format("MMM D, YYYY h:mm A")
        : "Never",
      status: user.isActive ? "Active" : "Inactive",
      isActive: user.isActive,
      userCategory: user.userCategory,
      photoUrl: user.photo || user.profileImage || null,
    }));
    queryParams.total = res.data.totalCount;
  } catch (err) {
    console.error("Error fetching users:", err);
    toast.error("Failed to load users");
  } finally {
    isLoading.value = false;
  }
};

// Filtered users based on status filter (search and role handled by API)
const filteredUsers = computed(() => {
  let result = users.value;

  // Client-side status filtering (API doesn't support this directly)
  if (filters.value.status && filters.value.status !== "all") {
    result = result.filter((user) => user.status === filters.value.status);
  }

  return result;
});

// Debounced search function
const debounceSearch = debounce(() => {
  queryParams.PageNumber = 1;
  fetchUsers();
}, 800);

// Watch for search query changes
watch(
  () => searchQuery.value,
  (newSearch) => {
    queryParams.Search = newSearch;
    debounceSearch();
  }
);

// Role filter mapping
const roleFilterMap: Record<string, number[]> = {
  Admin: [0, 3],
  "Platform User": [4],
  Member: [1, 2],
};

// Watch for filter changes
watch(
  () => filters.value.role,
  (newRole) => {
    if (newRole) {
      queryParams.userCategories = roleFilterMap[newRole];
    } else {
      queryParams.userCategories = [0, 1, 2, 3, 4];
    }
    queryParams.PageNumber = 1;
    fetchUsers();
  }
);

// Watch for status filter changes
watch(
  () => filters.value.status,
  () => {
    queryParams.PageNumber = 1;
    // Filtering happens in client-side computed property
  }
);

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleDownload = () => {
  toast.info("Download functionality coming soon");
};

const handleFilterChange = () => {
  // Watchers handle the actual filtering
};

const handleInviteUser = () => {
  inviteModal.value.isOpen = true;
};

const handleInviteSubmit = (data: any) => {
  if (data.type === "email") {
    console.log("Inviting users via email:", data);
    // TODO: Call API to send invites
    // Example: await inviteUsersByEmail(data.emails, data.roles);
  }
};

const handlePageChange = (event: any) => {
  queryParams.PageNumber = event.page + 1;
  fetchUsers();
};

const handleAction = (action: string, data: any, index: number) => {
  if (action === "suspend" || action === "reactivate") {
    confirmModal.value = {
      open: true,
      action,
      user: data,
    };
  } else if (action === "delete") {
    toast.info("Delete functionality coming soon");
  }
};

const confirmActionHandler = async () => {
  const { action, user } = confirmModal.value;
  actionLoading.value = true;

  try {
    await toggleUserStatus(user.email);
    const actionText = action === "suspend" ? "suspended" : "reactivated";
    toast.success(`User ${actionText} successfully`);
    confirmModal.value.open = false;
    fetchUsers();
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to update user status");
  } finally {
    actionLoading.value = false;
  }
};

// Load users on component mount
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="apps.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]"
    >
      <p class="text-[#475467] mb-4">No applications available.</p>
    </div>

    <!-- Apps Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]"
    >
      <!-- App Cards -->
      <AdminAppsCard
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @edit="handleEditApp"
        @delete="handleDeleteApp"
      />

      <!-- Add Application Card -->
      <div
        @click="handleAddApp"
        class="w-full h-auto p-6 bg-white border border-[#EAECF5] rounded-xl flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all cursor-pointer font-Avenir"
      >
        <div class="w-12 h-12 rounded-lg flex items-center justify-center">
          <ComputerSvg />
        </div>
        <div class="text-center">
          <h3 class="font-[350] text-base text-[#667085]">Add Application</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Application Modal -->
  <ApplicationModal
    :is-open="isApplicationModalOpen"
    :app="selectedApp"
    @close="closeApplicationModal"
    @submit="handleApplicationSubmit"
  />

  <!-- Delete Confirmation Modal -->
  <div
    v-if="selectedAppForDelete && isDeleteOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="closeDeleteModal"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold text-[#2F2F2F] mb-2">
        Delete Application
      </h3>
      <p class="text-sm text-[#667085] mb-6">
        Are you sure you want to delete <strong>{{ selectedAppForDelete.name }}</strong
        >? This action cannot be undone.
      </p>
      <div class="flex gap-3">
        <button
          @click="closeDeleteModal"
          class="flex-1 px-4 py-2 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB] transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          :disabled="isDeleting"
          class="flex-1 px-4 py-2 bg-[#D92D20] text-white rounded-lg hover:bg-[#B42318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ComputerSvg from "~/assets/images/icon/ComputerSvg.vue";
import { useToast } from "~/composables/useToast";
import { getSubApps, deleteSubApp } from "~/services/userservices";

interface App {
  id: string;
  code: string;
  name: string;
  description?: string;
  iconUrl?: string;
  url?: string;
  isDisabled: boolean;
}

const toast = useToast();

const apps = ref<App[]>([]);
const isLoading = ref(false);
const selectedApp = ref<App | null>(null);
const selectedAppForDelete = ref<App | null>(null);
const isApplicationModalOpen = ref(false);
const isDeleteOpen = ref(false);
const isDeleting = ref(false);

onMounted(() => {
  loadApps();
});

const loadApps = async () => {
  isLoading.value = true;
  try {
    const response = await getSubApps();
    if (response.status === 200) {
      apps.value = response.data.data || [];
    }
  } catch (error) {
    toast.error("Failed to load applications");
    console.error("Error loading apps:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleAddApp = () => {
  selectedApp.value = null;
  isApplicationModalOpen.value = true;
};

const handleEditApp = (app: App) => {
  selectedApp.value = app;
  isApplicationModalOpen.value = true;
};

const handleDeleteApp = (app: App) => {
  selectedAppForDelete.value = app;
  isDeleteOpen.value = true;
};

const closeApplicationModal = () => {
  isApplicationModalOpen.value = false;
  selectedApp.value = null;
};

const closeDeleteModal = () => {
  isDeleteOpen.value = false;
  selectedAppForDelete.value = null;
};

const handleApplicationSubmit = async () => {
  await loadApps();
};

const confirmDelete = async () => {
  if (!selectedAppForDelete.value) return;

  isDeleting.value = true;
  try {
    const response = await deleteSubApp(selectedAppForDelete.value.id);
    if (response.status === 200) {
      toast.success("Application deleted successfully");
      closeDeleteModal();
      await loadApps();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to delete application");
    console.error("Error deleting app:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

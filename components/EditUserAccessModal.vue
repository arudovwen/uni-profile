<template>
  <IndexModal :is-open="isOpen" :can-close="true" @toggle-popup="closeModal">
    <template #content>
      <div class="w-[346px] bg-white rounded-[12px]">
        <!-- Modal Header -->
        <div class="border-b border-[#E4E7EC] px-[25px] py-[21px]">
          <h2 class="text-base font-[800] text-[#475467]">Edit User Access</h2>
          <p class="text-sm font-[350] text-[#475467]">
            Add or remove user's access to applications
          </p>
        </div>

        <!-- Applications List -->
        <div class="px-[25px] py-[20px] space-y-[4px]">
          <div v-if="localApplications.length === 0" class="text-sm text-[#667085] text-center py-4">
            No apps available
          </div>
          <div
            v-else
            v-for="(app, index) in localApplications"
            :key="app.id"
            class="flex items-center gap-3"
          >
            <input
              type="checkbox"
              :id="`app-${app.id}`"
              v-model="app.selected"
              class="w-4 h-4 rounded border border-[#3381FF] bg-[#3381FF] cursor-pointer accent-[#1570EF]"
            />
            <label
              :for="`app-${app.id}`"
              class="text-sm font-[350] text-[#475467] cursor-pointer flex-1"
            >
              {{ app.name }}
            </label>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-[#F2F4F7]"></div>

        <!-- Button -->
        <div class="px-[25px] py-5 flex justify-end">
          <button
            @click="handleUpdate"
            :disabled="isLoading"
            class="px-3 py-2 bg-[#1570EF] text-white font-[500] text-sm rounded-lg hover:bg-[#1266D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? "Updating..." : "Update User Access" }}
          </button>
        </div>
      </div>
    </template>
  </IndexModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useToast } from "~/composables/useToast";
import { ownerToggleAppAccess } from "~/services/userservices";
import IndexModal from "~/components/IndexModal.vue";

interface Application {
  id: string;
  name: string;
  code: string;
  selected: boolean;
  originalSelected: boolean;
}

interface Props {
  isOpen: boolean;
  user: any | null;
  availableApps: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const toast = useToast();
const isLoading = ref(false);

const localApplications = ref<Application[]>([]);

// Reset applications when modal opens/closes or user/apps changes
watch(
  [() => props.isOpen, () => props.availableApps],
  ([newIsOpen]) => {
    if (newIsOpen && props.availableApps) {
      const userAppCodes = props.user?.appCodes || [];
      localApplications.value = props.availableApps.map((app: any) => {
        const isSelected = userAppCodes.includes(app.code);
        return {
          id: app.id,
          name: app.name,
          code: app.code,
          selected: isSelected,
          originalSelected: isSelected,
        };
      });
    }
  },
  { immediate: true }
);

// Check if there are any changes
const hasChanges = computed(() => {
  return localApplications.value.some(
    (app) => app.selected !== app.originalSelected
  );
});

const closeModal = () => {
  emit("close");
};

const handleUpdate = async () => {
  if (!hasChanges.value) {
    toast.info("No changes to save");
    return;
  }

  if (!props.user) {
    toast.error("User information is missing");
    return;
  }

  isLoading.value = true;

  try {
    // Find apps that have changed
    const changedApps = localApplications.value.filter(
      (app) => app.selected !== app.originalSelected
    );

    // Toggle access for each changed app
    for (const app of changedApps) {
      await ownerToggleAppAccess({
        email: props.user.email,
        appCode: app.code,
        status: app.selected,
      });
    }

    toast.success("User access updated successfully");
    emit("success");
    closeModal();
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Failed to update user access"
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

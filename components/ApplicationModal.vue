<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 backdrop-blur z-40 flex justify-center overflow-y-auto pt-[100px] p-4 bg-[#000000a3]"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-[12px] w-[480px] max-h-[90vh] h-fit overflow-y-auto no-scrollbar"
      style="box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)"
    >
      <!-- Header -->
      <div class="relative pt-6 px-[25px] pb-5">
        <div class="pr-12">
          <h2 class="text-[16px] font-[800] text-[#2F2F2F] leading-6">
            {{ isEditMode ? 'Edit Application' : 'Create Application' }}
          </h2>
          <p class="text-[14px] font-[350] text-[#475467] leading-5 mt-[15px]">
            {{ isEditMode
              ? 'Update application details and settings'
              : 'Provision applications that would be accessible to users on the Matta Pro Platform'
            }}
          </p>
        </div>
        <button
          @click="closeModal"
          class="absolute top-[11px] right-4 w-11 h-11 flex items-center justify-center rounded-[8px] text-[#98A2B3] hover:text-[#2F2F2F] transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="px-[25px] pb-7 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Logo Upload Section -->
          <div class="w-[427px] h-12 flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden border border-black/8"
            >
              <img
                v-if="logoPreview"
                :src="logoPreview"
                :alt="formData.name"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                class="w-6 h-6 text-[#9CA3AF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <label class="cursor-pointer">
              <span class="text-[14px] font-[400] text-[#667085] leading-6">
                Upload Application Logo
              </span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
            </label>
          </div>
          <p v-if="logoError" class="text-xs text-[#DC2626]">{{ logoError }}</p>

          <!-- Application Name -->
          <div class="space-y-1">
            <label class="block text-[14px] font-[500] text-[#2F2F2F] leading-5">
              Application Name
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Oxide Pro"
              class="w-full px-[17px] py-[11px] border border-[#E2E2E2] rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <p v-if="errors.name" class="text-xs text-[#DC2626]">{{ errors.name }}</p>
          </div>

          <!-- Application URL -->
          <div class="space-y-1">
            <label class="block text-[14px] font-[500] text-[#2F2F2F] leading-5">
              Application URL
            </label>
            <input
              v-model="formData.url"
              type="text"
              placeholder="https://oxidepro.matta.com"
              class="w-full px-[17px] py-[11px] border border-[#E2E2E2] rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <p v-if="errors.url" class="text-xs text-[#DC2626]">{{ errors.url }}</p>
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <label class="block text-[14px] font-[500] text-[#2F2F2F] leading-5">
              Description
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Type description here"
              rows="4"
              class="w-full px-[17px] py-[11px] border border-[#E2E2E2] rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            ></textarea>
            <p v-if="errors.description" class="text-xs text-[#DC2626]">
              {{ errors.description }}
            </p>
          </div>

          <!-- Status Dropdown -->
          <div class="space-y-1">
            <CustomDropdown
              v-model="selectedStatus"
              :options="statusOptions"
              label="Status"
              placeholder="Select status"
              :showSearchFilter="false"
              size="md"
              containerStyles="w-full"
              buttonClass="w-full rounded-[5px] border-[#E2E2E2]"
            />
            <p class="text-[12px] font-[350] text-[#98A2B3] leading-5 mt-1">
              This determines the visibility of the applications for the users
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-[174px] h-9 px-3 py-2 bg-[#1570EF] text-white font-[500] text-[14px] leading-5 rounded-[8px] hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Application' : 'Create Application')
            }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';
import { addSubApp, editSubApp, uploadAppLogo } from '~/services/userservices';
import CustomDropdown from '~/components/Onboarding/CustomDropdown.vue';

interface ApplicationModalProps {
  isOpen: boolean;
  app?: {
    id: string;
    name: string;
    url: string;
    description: string;
    iconUrl?: string;
    isDisabled: boolean;
  } | null;
}

interface FormData {
  name: string;
  url: string;
  description: string;
  isDisabled: boolean;
}

const props = withDefaults(defineProps<ApplicationModalProps>(), {
  app: null,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit'): void;
}>();

const toast = useToast();

// Status options for CustomDropdown
const statusOptions = [
  { code: 'active', name: 'Active' },
  { code: 'inactive', name: 'Inactive' },
];

const formData = ref<FormData>({
  name: '',
  url: '',
  description: '',
  isDisabled: false,
});

const selectedStatus = ref(statusOptions[0]);

const logoFile = ref<File | null>(null);
const logoPreview = ref<string>('');
const logoError = ref<string>('');
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const isEditMode = computed(() => !!props.app);

// Watch for app changes to populate form
watch(
  () => props.app,
  (newApp) => {
    if (newApp) {
      formData.value = {
        name: newApp.name,
        url: newApp.url,
        description: newApp.description,
        isDisabled: newApp.isDisabled,
      };
      selectedStatus.value = newApp.isDisabled ? statusOptions[1] : statusOptions[0];
      if (newApp.iconUrl) {
        logoPreview.value = newApp.iconUrl;
      }
    } else {
      resetForm();
    }
  },
  { deep: true }
);

// Sync selectedStatus with formData.isDisabled
watch(
  selectedStatus,
  (newStatus) => {
    formData.value.isDisabled = newStatus.code === 'inactive';
  }
);

const resetForm = () => {
  formData.value = {
    name: '',
    url: '',
    description: '',
    isDisabled: false,
  };
  selectedStatus.value = statusOptions[0];
  logoFile.value = null;
  logoPreview.value = '';
  logoError.value = '';
  errors.value = {};
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    logoError.value = 'Please select a valid image file';
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    logoError.value = 'File size must be less than 5MB';
    return;
  }

  logoFile.value = file;
  logoError.value = '';

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.name.trim()) {
    errors.value.name = 'Application name is required';
  }

  if (!formData.value.url.trim()) {
    errors.value.url = 'Application URL is required';
  } else if (!isValidUrl(formData.value.url)) {
    errors.value.url = 'Please enter a valid URL';
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required';
  }

  if (!isEditMode.value && !logoFile.value && !logoPreview.value) {
    logoError.value = 'Logo is required';
    return false;
  }

  return Object.keys(errors.value).length === 0;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    let logoUrl = logoPreview.value
    
    // Upload logo if a new file was selected
    if (logoFile.value) {
      try {
        const uploadResponse = await uploadAppLogo(logoPreview.value.split("base64,")[1] || '');
        
        // Check if upload was successful
        if (!uploadResponse.data?.succeeded) {
          logoError.value = uploadResponse.data?.message || 'Failed to upload logo';
          toast.error(logoError.value);
          isLoading.value = false;
          return;
        }

        // Use the uploaded URL from response
        logoUrl = uploadResponse.data?.data;
        
        if (!logoUrl) {
          logoError.value = 'Upload successful but no URL returned';
          toast.error(logoError.value);
          isLoading.value = false;
          return;
        }
      } catch (uploadError: any) {
        const errorMessage = uploadError.response?.data?.message || 
                           uploadError.message || 
                           'Failed to upload logo';
        logoError.value = errorMessage;
        toast.error(errorMessage);
        isLoading.value = false;
        return;
      }
    }

    const submitData = {
      ...formData.value,
      iconUrl: logoUrl,
      isTwoFactorAuthEnabled: true,
    };

    if (isEditMode.value && props.app) {
      await editSubApp({
        ...submitData,
        id: props.app.id,
      });
      toast.success('Application updated successfully');
    } else {
      await addSubApp(submitData);
      toast.success('Application created successfully');
    }

    emit('submit');
    closeModal();
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'An error occurred');
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  resetForm();
  emit('close');
};
</script>

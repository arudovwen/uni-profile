import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Information from '@/components/Pages/Users/Profile/Information.vue';
import { getUserProfile, updateUserProfile } from '~/services/settingservices';
import { toast } from 'vue3-toastify';

vi.mock('~/services/settingservices', () => ({
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  updateCompanyProfile: vi.fn(),
}));

vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockBusinessTypes = [
  { sector: 'Technology' },
  { sector: 'Finance' }
];

vi.stubGlobal('businessTypes', mockBusinessTypes);

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({ user: { id: 1 } }),
}));

describe('Information.vue', () => {
  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    contactEmail: 'john@example.com',
    phone: '123456789012345678',
    address: '123 Test St',
    photo: 'photo.jpg',
    category: 'Technology'
  };

  const globalOptions = {
    stubs: {
      HeaderComponent: true,
      FileUploadToo: true,
      Textinput: {
        template: '<input class="test-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
        props: ['modelValue']
      },
      FormGroup: {
        template: '<div><slot /></div>'
      },
      FormsPhoneCodes: true,
      Select: {
        template: '<select></select>',
        props: ['options', 'modelValue']
      },
      AppButton: {
        template: '<button>{{text}}</button>',
        props: ['text', 'isLoading', 'disabled']
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('businessTypes', mockBusinessTypes);
    getUserProfile.mockResolvedValue({
      status: 200,
      data: { data: mockUserData }
    });
  });

  it('fetches and populates user profile on mount', async () => {
    const wrapper = mount(Information, { global: globalOptions });
    await vi.waitFor(() => expect(getUserProfile).toHaveBeenCalled());
    await nextTick();
    await nextTick();
    expect(wrapper.vm.values.firstName).toBe('John');
  });

  it('submits form successfully', async () => {
    updateUserProfile.mockResolvedValue({ status: 200 });
    const wrapper = mount(Information, { global: globalOptions });
    await nextTick();
    await wrapper.find('form').trigger('submit');
    await vi.waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Profile updated');
    });
  });

  it('handles submission error with response message', async () => {
    updateUserProfile.mockRejectedValue({
      response: { data: { message: 'Error' } }
    });
    const wrapper = mount(Information, { global: globalOptions });
    await wrapper.find('form').trigger('submit');
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error'));
  });

  it('handles submission error with alternative Message key', async () => {
    updateUserProfile.mockRejectedValue({
      response: { data: { Message: 'Alt Error' } }
    });
    const wrapper = mount(Information, { global: globalOptions });
    await wrapper.find('form').trigger('submit');
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('Alt Error'));
  });

  it('handles submission error with default message', async () => {
    updateUserProfile.mockRejectedValue({});
    const wrapper = mount(Information, { global: globalOptions });
    await wrapper.find('form').trigger('submit');
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('Something went wrong, try again later'));
  });
});
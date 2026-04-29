import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { getUserDetail, updateUserProfile } from "~/services/settingservices";
import { getSingleInvite } from "~/services/userservices";
import { toast } from "vue3-toastify";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({
    params: { id: 'user-123' }
  }))
}));

import Information from '@/components/Pages/Users/UserDetail/Information.vue';

vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn(),
  updateUserProfile: vi.fn()
}));

vi.mock("~/services/userservices", () => ({
  getSingleInvite: vi.fn()
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.stubGlobal('useAuthStore', () => vi.fn(() => ({})));

describe('Information.vue', () => {
  let wrapper;

  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    contactEmail: 'john@example.com',
    phone: '1234567890',
    address: 'Street 1',
    category: 'Tech',
    photo: 'photo.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getSingleInvite.mockResolvedValue({ status: 200, data: { data: mockUserData } });
    getUserDetail.mockResolvedValue({ status: 200, data: { data: mockUserData } });
  });

  const createWrapper = () => {
    return mount(Information, {
      global: {
        stubs: { Textinput: true, FormGroup: true, PhoneNumber: true }
      }
    });
  };

  it('handles API failures on mount', async () => {
    getSingleInvite.mockResolvedValue({ status: 404 });
    getUserDetail.mockResolvedValue({ status: 500 });

    wrapper = createWrapper();

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('submits successfully and shows success toast', async () => {
    updateUserProfile.mockResolvedValue({ status: 200 });
    wrapper = createWrapper();

    await nextTick();
    wrapper.vm.setValues(mockUserData);
    
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(updateUserProfile).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Profile updated');
  });

  it('handles submission error with generic message', async () => {
    updateUserProfile.mockRejectedValue(new Error('Generic Error'));

    wrapper = createWrapper();
    await nextTick();
    wrapper.vm.setValues(mockUserData);
    
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(toast.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('handles submission error with response message', async () => {
    updateUserProfile.mockRejectedValue({
      response: { data: { message: 'Api Error Message' } }
    });

    wrapper = createWrapper();
    await nextTick();
    wrapper.vm.setValues(mockUserData);

    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(toast.error).toHaveBeenCalledWith('Api Error Message');
  });

  it('handles submission error with uppercase Message', async () => {
    updateUserProfile.mockRejectedValue({
      response: { data: { Message: 'Uppercase Error' } }
    });

    wrapper = createWrapper();
    await nextTick();
    wrapper.vm.setValues(mockUserData);

    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(toast.error).toHaveBeenCalledWith('Uppercase Error');
  });
});
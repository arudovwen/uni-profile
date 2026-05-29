import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref, computed, watch } from 'vue';
import ApplicationModal from '@/components/ApplicationModal.vue';
import { addSubApp, editSubApp, uploadAppLogo } from '~/services/userservices';

vi.mock('~/services/userservices', () => ({
  addSubApp: vi.fn(),
  editSubApp: vi.fn(),
  uploadAppLogo: vi.fn()
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
};

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockToast
}));

class MockFileReader {
  onload: any;
  readAsDataURL(file: File) {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,teststring' } });
      }
    }, 1);
  }
}
vi.stubGlobal('FileReader', MockFileReader);

describe('ApplicationModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (props = { isOpen: true, app: null }) => {
    return mount(ApplicationModal, {
      props,
      global: {
        stubs: {
          CustomDropdown: {
            template: '<div class="custom-dropdown-stub"></div>',
            props: ['modelValue'],
            emits: ['update:modelValue']
          }
        }
      }
    });
  };

  it('does not render when isOpen is false', () => {
    const wrapper = createWrapper({ isOpen: false, app: null });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('renders in create mode by default', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h2').text()).toBe('Create Application');
    expect(wrapper.find('p').text()).toContain('Provision applications');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create Application');
  });

  it('emits close event on backdrop click', async () => {
    const wrapper = createWrapper();
    await wrapper.find('.fixed').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits close event on close button click', async () => {
    const wrapper = createWrapper();
    await wrapper.find('button.absolute').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('populates form fields when app prop is provided', async () => {
    const appData = {
      id: '123',
      name: 'Test App',
      url: 'https://test.com',
      description: 'Test description',
      iconUrl: 'https://test.com/logo.png',
      isDisabled: true,
      isTwoFactorAuthEnabled: true
    };
    const wrapper = createWrapper({ isOpen: true, app: null });
    await wrapper.setProps({ app: appData });
    expect(wrapper.find('h2').text()).toBe('Edit Application');
    expect(wrapper.vm.formData.name).toBe('Test App');
    expect(wrapper.vm.selectedStatus.code).toBe('inactive');
    expect(wrapper.find('img').attributes('src')).toBe('https://test.com/logo.png');
  });

  it('handles missing optional fields in app prop gracefully', async () => {
    const appData = {
      id: '123',
      name: 'Test App',
      url: 'https://test.com',
      description: 'Test description',
      isDisabled: false
    };
    const wrapper = createWrapper({ isOpen: true, app: null });
    await wrapper.setProps({ app: appData });
    expect(wrapper.vm.formData.isTwoFactorAuthEnabled).toBe(false);
  });

  it('resets form when app prop becomes null', async () => {
    const appData = {
      id: '123',
      name: 'Test App',
      url: 'https://test.com',
      description: 'Test description',
      isDisabled: false
    };
    const wrapper = createWrapper({ isOpen: true, app: appData });
    await wrapper.setProps({ app: null });
    expect(wrapper.vm.formData.name).toBe('');
  });

  it('updates formData isDisabled status when selectedStatus changes', async () => {
    const wrapper = createWrapper();
    wrapper.vm.selectedStatus = { code: 'inactive', name: 'Inactive' };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formData.isDisabled).toBe(true);
  });

  it('toggles two factor authentication field value', async () => {
    const wrapper = createWrapper();
    const toggleBtn = wrapper.find('button[type="button"]');
    await toggleBtn.trigger('click');
    expect(wrapper.vm.formData.isTwoFactorAuthEnabled).toBe(true);
    await toggleBtn.trigger('click');
    expect(wrapper.vm.formData.isTwoFactorAuthEnabled).toBe(false);
  });

  it('ignores logo upload when file list is empty', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
      value: [],
      writable: true
    });
    await input.trigger('change');
    expect(wrapper.vm.logoFile).toBeNull();
  });

  it('validates logo file type correctly', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['text'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true
    });
    await input.trigger('change');
    expect(wrapper.vm.logoError).toBe('Please select a valid image file');
  });

  it('validates logo file size correctly', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['image'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true
    });
    await input.trigger('change');
    expect(wrapper.vm.logoError).toBe('File size must be less than 5MB');
  });

  it('processes and reads valid logo file successfully', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['image'], 'test.png', { type: 'image/png' });
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true
    });
    await input.trigger('change');
    expect(wrapper.vm.logoFile).toEqual(file);
    expect(wrapper.vm.logoError).toBe('');
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(wrapper.vm.logoPreview).toBe('data:image/png;base64,teststring');
  });

  it('fails validation when form text inputs are empty', async () => {
    const wrapper = createWrapper();
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.errors.name).toBe('Application name is required');
    expect(wrapper.vm.errors.url).toBe('Application URL is required');
    expect(wrapper.vm.errors.description).toBe('Description is required');
  });

  it('fails validation when url format is invalid', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'invalid-url';
    wrapper.vm.formData.description = 'Desc';
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.errors.url).toBe('Please enter a valid URL');
  });

  it('fails validation when logo is missing in create mode', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.logoError).toBe('Logo is required');
  });

  it('handles logo upload rejection during form submission', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'data:image/png;base64,test';
    vi.mocked(uploadAppLogo).mockResolvedValueOnce({ data: { succeeded: false, message: 'Upload rejection' } });
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.vm.logoError).toBe('Upload rejection');
    expect(mockToast.error).toHaveBeenCalledWith('Upload rejection');
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('handles logo upload success with missing data payload url', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'data:image/png;base64,test';
    vi.mocked(uploadAppLogo).mockResolvedValueOnce({ data: { succeeded: true, data: null } });
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.vm.logoError).toBe('Upload successful but no URL returned');
    expect(mockToast.error).toHaveBeenCalledWith('Upload successful but no URL returned');
  });

  it('handles upload logo exceptions with response message metadata', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'data:image/png;base64,test';
    vi.mocked(uploadAppLogo).mockRejectedValueOnce({ response: { data: { message: 'Network network error' } } });
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.vm.logoError).toBe('Network network error');
    expect(mockToast.error).toHaveBeenCalledWith('Network network error');
  });

  it('handles upload logo exceptions with standard error context object', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'data:image/png;base64,test';
    vi.mocked(uploadAppLogo).mockRejectedValueOnce(new Error('Fatal error context'));
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.vm.logoError).toBe('Fatal error context');
  });

  it('handles upload logo exceptions with empty fallback structure context string', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'data:image/png;base64,test';
    vi.mocked(uploadAppLogo).mockRejectedValueOnce({});
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.vm.logoError).toBe('Failed to upload logo');
  });

  it('submits form successfully without base64 processing string structure fallback', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoFile = new File([''], 'test.png');
    wrapper.vm.logoPreview = 'nobase64content';
    vi.mocked(uploadAppLogo).mockResolvedValueOnce({ data: { succeeded: true, data: 'https://cdn.com/logo.png' } });
    await wrapper.find('form').trigger('submit.prevent');
    expect(uploadAppLogo).toHaveBeenCalledWith('');
  });

  it('submits successfully in create mode and alerts container suite', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'New Application';
    wrapper.vm.formData.url = 'https://newapp.com';
    wrapper.vm.formData.description = 'Description data';
    wrapper.vm.logoPreview = 'https://existing-image.com/img.png';
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(addSubApp).toHaveBeenCalledWith({
      name: 'New Application',
      url: 'https://newapp.com',
      description: 'Description data',
      isDisabled: false,
      isTwoFactorAuthEnabled: false,
      iconUrl: 'https://existing-image.com/img.png'
    });
    expect(mockToast.success).toHaveBeenCalledWith('Application created successfully');
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('submits successfully in edit mode and alerts container suite', async () => {
    const appData = {
      id: '999',
      name: 'Old App Name',
      url: 'https://old.com',
      description: 'Old Description',
      isDisabled: false
    };
    const wrapper = createWrapper({ isOpen: true, app: null });
    await wrapper.setProps({ app: appData });
    wrapper.vm.formData.name = 'Updated App Name';
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(editSubApp).toHaveBeenCalledWith({
      id: '999',
      name: 'Updated App Name',
      url: 'https://old.com',
      description: 'Old Description',
      isDisabled: false,
      isTwoFactorAuthEnabled: false,
      iconUrl: ''
    });
    expect(mockToast.success).toHaveBeenCalledWith('Application updated successfully');
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('handles backend service submit error with server exception messaging metadata', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoPreview = 'https://logo.com';
    vi.mocked(addSubApp).mockRejectedValueOnce({ response: { data: { message: 'Database entity validation failed' } } });
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Database entity validation failed');
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('handles backend service submit error with default placeholder error context', async () => {
    const wrapper = createWrapper();
    wrapper.vm.formData.name = 'App';
    wrapper.vm.formData.url = 'https://valid.com';
    wrapper.vm.formData.description = 'Desc';
    wrapper.vm.logoPreview = 'https://logo.com';
    vi.mocked(addSubApp).mockRejectedValueOnce({});
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('An error occurred');
  });

  it('displays loading texts on button component when isLoading is true', async () => {
    const wrapper = createWrapper();
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('button[type="submit"]').text()).toBe('Creating...');
    await wrapper.setProps({
      app: { id: '1', name: 'A', url: 'https://a.com', description: 'D', isDisabled: false }
    });
    expect(wrapper.find('button[type="submit"]').text()).toBe('Updating...');
  });
});
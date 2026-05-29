import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import EditUserAccessModal from '@/components/EditUserAccessModal.vue';
import { ownerToggleAppAccess } from '~/services/userservices';

vi.mock('~/services/userservices', () => ({
  ownerToggleAppAccess: vi.fn()
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
};

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockToast
}));

describe('EditUserAccessModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    user: { email: 'test@example.com', appCodes: ['APP1'] },
    availableApps: [
      { id: '1', name: 'App One', code: 'APP1' },
      { id: '2', name: 'App Two', code: 'APP2' }
    ]
  };

  const createWrapper = (props = defaultProps) => {
    return mount(EditUserAccessModal, {
      props,
      global: {
        stubs: {
          IndexModal: {
            template: '<div><slot name="content" /></div>',
            props: ['isOpen', 'canClose'],
            emits: ['toggle-popup']
          }
        }
      }
    });
  };

  it('renders "No apps available" when availableApps list is empty', () => {
    const wrapper = createWrapper({
      isOpen: true,
      user: { email: 'test@example.com', appCodes: [] },
      availableApps: []
    });
    expect(wrapper.find('.text-center').text()).toBe('No apps available');
  });

  it('renders list of available apps with correct selection state', () => {
    const wrapper = createWrapper();
    const items = wrapper.findAll('input[type="checkbox"]');
    expect(items).toHaveLength(2);
    expect((items[0].element as HTMLInputElement).checked).toBe(true);
    expect((items[1].element as HTMLInputElement).checked).toBe(false);
  });

  it('populates apps list when user payload structure is missing application codes', () => {
    const wrapper = createWrapper({
      isOpen: true,
      user: null,
      availableApps: [{ id: '1', name: 'App One', code: 'APP1' }]
    });
    expect(wrapper.vm.localApplications[0].selected).toBe(false);
  });

  it('skips setup operations when isOpen state context flag is false', () => {
    const wrapper = mount(EditUserAccessModal, {
      props: {
        isOpen: false,
        user: { email: 'test@example.com', appCodes: ['APP1'] },
        availableApps: [{ id: '1', name: 'App One', code: 'APP1' }]
      },
      global: {
        stubs: {
          IndexModal: { template: '<div><slot name="content" /></div>' }
        }
      }
    });
    expect(wrapper.vm.localApplications).toHaveLength(0);
  });

  it('triggers closeModal lifecycle event chain when triggering stub wrapper event', () => {
    const wrapper = mount(EditUserAccessModal, {
      props: defaultProps,
      global: {
        stubs: {
          IndexModal: {
            template: '<div class="modal-stub"><button @click="$emit(\'toggle-popup\')">Close</button><slot name="content" /></div>'
          }
        }
      }
    });
    wrapper.find('.modal-stub button').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('shows info notification and prevents execution when submitting without functional variance edits', async () => {
    const wrapper = createWrapper();
    await wrapper.find('button').trigger('click');
    expect(mockToast.info).toHaveBeenCalledWith('No changes to save');
    expect(ownerToggleAppAccess).not.toHaveBeenCalled();
  });

  it('shows failure notification message when submitting edits with unassigned state object context values', async () => {
    const wrapper = createWrapper();
    wrapper.vm.localApplications[1].selected = true;
    await wrapper.setProps({ user: null });
    await wrapper.find('button').trigger('click');
    expect(mockToast.error).toHaveBeenCalledWith('User information is missing');
    expect(ownerToggleAppAccess).not.toHaveBeenCalled();
  });

  it('handles backend service access toggles successfully for all checked changes items', async () => {
    const wrapper = createWrapper();
    wrapper.vm.localApplications[0].selected = false;
    wrapper.vm.localApplications[1].selected = true;
    vi.mocked(ownerToggleAppAccess).mockResolvedValue({ data: {} });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(ownerToggleAppAccess).toHaveBeenCalledTimes(2);
    expect(ownerToggleAppAccess).toHaveBeenNthCalledWith(1, {
      email: 'test@example.com',
      appCode: 'APP1',
      status: false
    });
    expect(ownerToggleAppAccess).toHaveBeenNthCalledWith(2, {
      email: 'test@example.com',
      appCode: 'APP2',
      status: true
    });
    expect(mockToast.success).toHaveBeenCalledWith('User access updated successfully');
    expect(wrapper.emitted('success')).toBeTruthy();
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('handles backend exceptions displaying standard structure response message payload parameters', async () => {
    const wrapper = createWrapper();
    wrapper.vm.localApplications[1].selected = true;
    vi.mocked(ownerToggleAppAccess).mockRejectedValueOnce({
      response: { data: { message: 'First variant failure error' } }
    });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('First variant failure error');
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('handles backend exceptions displaying capitalized structure response message payload parameters', async () => {
    const wrapper = createWrapper();
    wrapper.vm.localApplications[1].selected = true;
    vi.mocked(ownerToggleAppAccess).mockRejectedValueOnce({
      response: { data: { Message: 'Second variant failure error' } }
    });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Second variant failure error');
  });

  it('handles backend exceptions using default exception fallback messaging content strings', async () => {
    const wrapper = createWrapper();
    wrapper.vm.localApplications[1].selected = true;
    vi.mocked(ownerToggleAppAccess).mockRejectedValueOnce({});
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Failed to update user access');
  });

  it('displays loading state message labels on execution process updates', async () => {
    const wrapper = createWrapper();
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('button').text()).toBe('Updating...');
  });
});
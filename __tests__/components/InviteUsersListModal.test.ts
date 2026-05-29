import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref, reactive } from 'vue';
import InviteUsersListModal from '@/components/InviteUsersListModal.vue';
import { sendOwnerInvite } from '~/services/userservices';

vi.mock('~/services/userservices', () => ({
  sendAdminInvite: vi.fn(),
  sendOwnerInvite: vi.fn()
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
};

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockToast
}));

describe('InviteUsersListModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    availableApps: [
      { id: '1', name: 'Polymer', code: 'POL628' },
      { id: '2', name: 'Other App', code: 'OTH' }
    ]
  };

  const createWrapper = (props = defaultProps) => {
    return mount(InviteUsersListModal, {
      props,
      global: {
        stubs: {
          IndexModal: {
            template: '<div><slot name="content" /></div>',
            props: ['isOpen'],
            emits: ['togglePopup']
          },
          MultiSelectDropdown: {
            template: '<div class="multiselect-stub"></div>',
            props: ['modelValue', 'options'],
            emits: ['update:modelValue']
          },
          CustomDropdown: {
            template: '<div class="custom-dropdown-stub"></div>',
            props: ['modelValue', 'options'],
            emits: ['update:modelValue']
          }
        }
      }
    });
  };

  it('computes empty array options when availableApps prop structure is omitted', () => {
    const wrapper = createWrapper({ isOpen: true, availableApps: null as any });
    expect(wrapper.vm.appOptions).toEqual([]);
  });

  it('computes fallback app options using code value when application name property is empty', () => {
    const wrapper = createWrapper({
      isOpen: true,
      availableApps: [{ id: '3', code: 'XYZ' }]
    });
    expect(wrapper.vm.appOptions).toEqual([{ code: 'XYZ', name: 'XYZ' }]);
  });

  it('resets entry structure pairs data state when isOpen state transition updates to true', async () => {
    const wrapper = createWrapper({ isOpen: false, availableApps: [] });
    wrapper.vm.inviteData.email.pairs.push({
      emailAddresses: 'residual@test.com',
      apps: [],
      role: null
    });
    await wrapper.setProps({ isOpen: true });
    expect(wrapper.vm.inviteData.email.pairs).toHaveLength(1);
    expect(wrapper.vm.inviteData.email.pairs[0].emailAddresses).toBe('');
  });

  it('retains configuration state values unchanged when isOpen state updates to false', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs[0].emailAddresses = 'keep@test.com';
    await wrapper.setProps({ isOpen: false });
    expect(wrapper.vm.inviteData.email.pairs[0].emailAddresses).toBe('keep@test.com');
  });

  it('emits close event signal downstream when executing close process method handler', () => {
    const wrapper = createWrapper();
    wrapper.vm.closeModal();
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('appends matching empty initialization block elements on addAnotherPair loop execution clicks', async () => {
    const wrapper = createWrapper();
    const btn = wrapper.findAll('button').find(b => b.text().includes('Add another email'));
    await btn?.trigger('click');
    expect(wrapper.vm.inviteData.email.pairs).toHaveLength(2);
    expect(wrapper.vm.inviteData.email.pairs[1].emailAddresses).toBe('');
  });

  it('enforces disabled constraints on form button components when processing loading requests', async () => {
    const wrapper = createWrapper();
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Sending...'));
    expect(submitBtn?.element.disabled).toBe(true);
  });

  it('displays informational validation toast notification parameters when emails list is completely empty', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      { emailAddresses: '   , ,   ', apps: [], role: null }
    ];
    await wrapper.vm.sendInvites();
    expect(mockToast.error).toHaveBeenCalledWith('Please enter at least one email address');
  });

  it('displays validation feedback notifications when assigned app selection properties are missing elements', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      { emailAddresses: 'test@test.com', apps: [], role: null }
    ];
    await wrapper.vm.sendInvites();
    expect(mockToast.error).toHaveBeenCalledWith('Please select at least one app for each email');
  });

  it('restricts transaction submissions displaying mandatory selection roles error messaging labels', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      {
        emailAddresses: 'test@test.com',
        apps: [{ code: 'POL628', name: 'Polymer' }],
        role: null
      }
    ];
    await wrapper.vm.sendInvites();
    expect(mockToast.error).toHaveBeenCalledWith('Please select a role for Polymer');
  });

  it('processes server communication responses correctly handling single email dispatch success paths', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      {
        emailAddresses: 'success@test.com',
        apps: [
          { code: 'POL628', name: 'Polymer' },
          { code: 'OTH', name: 'Other App' }
        ],
        role: { code: '0', name: 'Admin' }
      }
    ];
    vi.mocked(sendOwnerInvite).mockResolvedValue({ status: 200 });
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(sendOwnerInvite).toHaveBeenCalledWith({
      email: 'success@test.com',
      appCodes: ['POL628', 'OTH'],
      appUserCategory: [
        { appCode: 'POL628', appUserCategory: 0 },
        { appCode: 'OTH', appUserCategory: 2 }
      ],
      role: 2
    });
    expect(mockToast.success).toHaveBeenCalledWith('Invite sent to 1 user(s)');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('processes server communication fallback workflows when role parameter configurations are unassigned', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      {
        emailAddresses: 'fallback@test.com',
        apps: [{ code: 'POL628', name: 'Polymer' }],
        role: {}
      }
    ];
    vi.mocked(sendOwnerInvite).mockResolvedValue({ status: 200 });
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(sendOwnerInvite).toHaveBeenCalledWith({
      email: 'fallback@test.com',
      appCodes: ['POL628'],
      appUserCategory: [{ appCode: 'POL628', appUserCategory: 2 }],
      role: 2
    });
  });

  it('intercepts partial network delivery failure arrays maintaining residual error strings tracking', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      {
        emailAddresses: 'done@test.com, fail1@test.com, fail2@test.com',
        apps: [{ code: 'OTH', name: 'Other App' }],
        role: null
      }
    ];
    vi.mocked(sendOwnerInvite)
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 400 })
      .mockRejectedValueOnce(new Error('Network drop error'));
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Failed to send invites to: fail1@test.com, fail2@test.com');
    expect(wrapper.vm.inviteData.email.pairs[0].emailAddresses).toBe('fail1@test.com, fail2@test.com');
  });

  it('handles absolute processing errors when every single server communication item throws failures', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      {
        emailAddresses: 'fail@test.com',
        apps: [{ code: 'OTH', name: 'Other App' }],
        role: null
      }
    ];
    vi.mocked(sendOwnerInvite).mockRejectedValue(new Error('Fatal transaction crash'));
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Failed to send all invites. Please try again.');
  });
});
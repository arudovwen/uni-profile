import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
};

const mockAuthStore = {
  appList: [{ code: 'APP1' }] as any[] | null,
  getAppsData: vi.fn()
};

vi.stubGlobal('useAuthStore', () => mockAuthStore);

vi.mock('#imports', () => ({
  useAuthStore: () => mockAuthStore,
  useToast: () => mockToast
}));

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}));

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockToast
}));

vi.mock('~/services/userservices', () => ({
  sendAdminInvite: vi.fn(),
  getSubApps: vi.fn(() => Promise.resolve({ data: [] }))
}));

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn()
  },
  configurable: true
});

import { mount, flushPromises } from '@vue/test-utils';
import InviteUsersModal from '@/components/InviteUsersModal.vue';
import { sendAdminInvite } from '~/services/userservices';

describe('InviteUsersModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.appList = [{ code: 'APP1' }];
    mockAuthStore.getAppsData = vi.fn();
  });

  const createWrapper = () => {
    return mount(InviteUsersModal, {
      props: { isOpen: true },
      global: {
        stubs: {
          IndexModal: {
            template: '<div><slot name="content" /></div>',
            props: ['isOpen'],
            emits: ['togglePopup']
          },
          CustomDropdown: {
            template: '<div class="dropdown-stub"></div>',
            props: ['modelValue', 'options'],
            emits: ['update:modelValue']
          },
          CopyLink: true,
          EmailSvg: true,
          AppIcon: true
        }
      }
    });
  };

  it('triggers authentication store retrieval lifecycles on mount actions', () => {
    createWrapper();
    expect(mockAuthStore.getAppsData).toHaveBeenCalled();
  });

  it('triggers authentication store safety fallbacks when retrieval methods are absent', () => {
    mockAuthStore.getAppsData = null as any;
    expect(() => createWrapper()).not.toThrow();
  });

  it('modifies navigation tab contexts when selection buttons are clicked', async () => {
    const wrapper = createWrapper();
    const tabs = wrapper.findAll('button');
    await tabs[1].trigger('click');
    expect(wrapper.vm.activeTab).toBe('email');
    await tabs[0].trigger('click');
    expect(wrapper.vm.activeTab).toBe('link');
  });

  it('dispatches functional closeModal signals to downstream listeners', () => {
    const wrapper = createWrapper();
    wrapper.vm.closeModal();
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('generates system links capturing active superadmin parameters inside write operations', () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.link.role = { code: 1, name: 'Superadmin' };
    wrapper.vm.copyInviteLink();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://app.matta.io/invite?role=1');
    expect(mockToast.success).toHaveBeenCalledWith('Invite link copied to clipboard');
  });

  it('generates system links capturing active platform admin parameters inside write operations', () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.link.role = { code: 0, name: 'Platform Admin' };
    wrapper.vm.copyInviteLink();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://app.matta.io/invite?role=0');
  });

  it('extends entry block allocation maps when appending alternative structures', () => {
    const wrapper = createWrapper();
    wrapper.vm.addAnotherPair();
    expect(wrapper.vm.inviteData.email.pairs).toHaveLength(2);
  });

  it('piles out array items based on index specs when executing removal operations', () => {
    const wrapper = createWrapper();
    wrapper.vm.addAnotherPair();
    wrapper.vm.removePair(1);
    expect(wrapper.vm.inviteData.email.pairs).toHaveLength(1);
  });

  it('intercepts execution pipelines presenting error toasts when parsing purely blank string sequences', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [{ emailAddresses: ' , , ', role: { code: 1, name: 'Superadmin' } }];
    await wrapper.vm.sendInvites();
    expect(mockToast.error).toHaveBeenCalledWith('Please enter at least one email address');
  });

  it('transmits payloads successfully across networks for each target address parsed', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [{ emailAddresses: 'user1@test.com', role: { code: 1, name: 'Superadmin' } }];
    vi.mocked(sendAdminInvite).mockResolvedValue({ status: 200 });
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(sendAdminInvite).toHaveBeenCalledWith({
      email: 'user1@test.com',
      role: 1,
      appCodes: ['APP1']
    });
    expect(mockToast.success).toHaveBeenCalledWith('Invite sent to 1 user(s)');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('processes operations safely defaulting tracking arrays when application metrics are null', async () => {
    const wrapper = createWrapper();
    mockAuthStore.appList = null;
    wrapper.vm.inviteData.email.pairs = [{ emailAddresses: 'user2@test.com', role: { code: 0, name: 'Platform Admin' } }];
    vi.mocked(sendAdminInvite).mockResolvedValue({ status: 200 });
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(sendAdminInvite).toHaveBeenCalledWith({
      email: 'user2@test.com',
      role: 0,
      appCodes: []
    });
  });

  it('handles absolute failures by displaying generalized system notification text labels', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [{ emailAddresses: 'fail@test.com', role: { code: 1, name: 'Superadmin' } }];
    vi.mocked(sendAdminInvite).mockRejectedValue(new Error('Crash'));
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Failed to send all invites. Please try again.');
  });

  it('isolates unique delivery issues compiling failing entries cleanly inside tracking view grids', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [
      { emailAddresses: 'pass@test.com, fail@test.com', role: { code: 1, name: 'Superadmin' } }
    ];
    vi.mocked(sendAdminInvite)
      .mockResolvedValueOnce({ status: 200 })
      .mockRejectedValueOnce(new Error('Network drop'));
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(mockToast.error).toHaveBeenCalledWith('Failed to send invites to: fail@test.com');
    expect(wrapper.vm.inviteData.email.pairs).toHaveLength(1);
    expect(wrapper.vm.inviteData.email.pairs[0].emailAddresses).toBe('fail@test.com');
  });

  it('intercepts scenarios where servers reply with invalid status parameters processing them as drops', async () => {
    const wrapper = createWrapper();
    wrapper.vm.inviteData.email.pairs = [{ emailAddresses: 'invalid@test.com', role: { code: 1, name: 'Superadmin' } }];
    vi.mocked(sendAdminInvite).mockResolvedValue({ status: 500 });
    await wrapper.vm.sendInvites();
    await flushPromises();
    expect(mockToast.success).toHaveBeenCalledWith('Invite sent to 0 user(s)');
  });
});
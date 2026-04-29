import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Apps from '@/components/Pages/Users/UserDetail/apps.vue';
import { getSubApps, ownerRevokeAccess } from "~/services/userservices";
import { getUserDetail } from "~/services/settingservices";

vi.mock("~/services/userservices", () => ({
  getSubApps: vi.fn(),
  ownerRevokeAccess: vi.fn()
}));

vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn()
}));

vi.mock("lodash/debounce", () => ({
  default: vi.fn((fn) => fn)
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const mockAuthStore = { userInfo: { userCategory: 1 } };
const mockToast = { info: vi.fn() };

const mountOptions = {
  global: {
    stubs: { 
      CustomTable: true, 
      DeleteModal: true, 
      ActionModal: true, 
      IndexModal: true, 
      AppStatusButton: true 
    },
    mocks: {
      $route: { params: { id: 'user-123' } }
    }
  }
};

vi.stubGlobal('useAuthStore', () => mockAuthStore);
vi.stubGlobal('toast', mockToast);
vi.stubGlobal('useRoute', () => ({
  params: { id: 'user-123' }
}));

describe('apps.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    getUserDetail.mockResolvedValue({
      status: 200,
      data: { data: { contactEmail: 'test@test.com', appCodes: ['APP1'] } }
    });
    getSubApps.mockResolvedValue({
      status: 200,
      data: { data: [{ name: 'App One', code: 'APP1' }, { name: 'App Two', code: 'APP2' }] }
    });
  });

  it('handles getSubApps failure', async () => {
    getUserDetail.mockResolvedValueOnce({
      status: 200,
      data: { data: { contactEmail: 'test@test.com' } }
    });
    getSubApps.mockRejectedValueOnce(new Error('API Error'));
    
    wrapper = mount(Apps, mountOptions);
    
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.setLoader).toBe(false);
  });

  it('toggles access successfully', async () => {
    ownerRevokeAccess.mockResolvedValueOnce({ status: 200 });
    
    wrapper = mount(Apps, mountOptions);
    
    await flushPromises();
    await nextTick();

    wrapper.vm.toggleAccess({ code: 'APP1' });
    await flushPromises();

    expect(ownerRevokeAccess).toHaveBeenCalledWith({
      email: 'test@test.com',
      appCode: 'APP1'
    });
    expect(mockToast.info).toHaveBeenCalledWith("Updated successfully");
  });

  it('handles toggle access failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    ownerRevokeAccess.mockRejectedValueOnce(new Error('Network Error'));
    
    wrapper = mount(Apps, mountOptions);
    
    await flushPromises();
    await nextTick();
    
    wrapper.vm.toggleAccess({ code: 'APP1' });
    await flushPromises();
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('filters columns for non-admin users', async () => {
    mockAuthStore.userInfo.userCategory = 2;
    wrapper = mount(Apps, mountOptions);
    await nextTick();
    expect(wrapper.vm.filteredColumns.find(c => c.key === 'action')).toBeUndefined();
    mockAuthStore.userInfo.userCategory = 1;
  });

  it('triggers search query watch', async () => {
    wrapper = mount(Apps, mountOptions);
    await nextTick();
    wrapper.vm.queryParams.Search = 'new search';
    await nextTick();
    expect(getUserDetail).toHaveBeenCalled();
  });

  it('triggers pagination watch', async () => {
    wrapper = mount(Apps, mountOptions);
    await nextTick();
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    expect(getUserDetail).toHaveBeenCalled();
  });

  it('handles modals and handleDelete', async () => {
    wrapper = mount(Apps, mountOptions);
    wrapper.vm.handleDelete();
    wrapper.vm.open = true;
    wrapper.vm.isOpen = true;
    wrapper.vm.isUpdateOpen = true;
    
    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.isUpdateOpen).toBe(true);
  });
});
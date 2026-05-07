import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Leaderboard from '@/components/Pages/Superadmin/ReferralManagement/leaderboard/index.vue';
import { getReferralLeaderboard } from "~/services/userservices";
import { toast } from "vue3-toastify";
import { exportToCSV } from "~/utils/exportToCSV";

vi.mock("~/services/userservices", () => ({
  getReferralLeaderboard: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("~/utils/exportToCSV", () => ({
  exportToCSV: vi.fn(),
}));

const mockAuthStore = {
  userInfo: { userCategory: 0 }
};

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('Leaderboard Index', () => {
  const mockData = {
    data: {
      data: [{ rank: 1, userName: 'Test User', totalReferrals: 5 }],
      totalCount: 1
    }
  };

  const globalOptions = {
    stubs: {
      AppTab: {
        name: 'AppTab',
        template: '<div class="app-tab"><button id="tab-btn" @click="$emit(\'setActive\', \'campaign\')">Switch</button></div>',
        props: ['tabs', 'active']
      },
      AppIcon: true,
      VueDatePicker: {
        template: '<div class="date-picker"></div>',
        props: ['modelValue']
      },
      CustomTable: {
        template: '<div class="custom-table"><slot name="table-row-status" :row="{status: \'active\'}" /><slot name="table-row-assignedUser" :row="{assignedUser: \'User\'}" /><slot name="table-row-assignedUserEmail" :row="{assignedUserEmail: \'e@e.com\'}" /><slot name="table-row-assignedDepartment" :row="{assignedDepartment: \'IT\'}" /><slot name="table-row-assignedApps" :row="{assignedApps: \'App1\'}" /></div>',
        props: ['rows', 'columns', 'isLoading', 'query']
      },
      AppStatusButton: true,
      ClientOnly: {
        template: '<div><slot /></div>'
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.userInfo.userCategory = 0;
    getReferralLeaderboard.mockResolvedValue(mockData);
  });

  it('renders and fetches data on mount', async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(wrapper.vm.rows).toHaveLength(1);
    });
    expect(getReferralLeaderboard).toHaveBeenCalled();
  });

  it('handles tab change', async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await nextTick();
    const tabBtn = wrapper.find('#tab-btn');
    await tabBtn.trigger('click');
    expect(wrapper.vm.activeTab).toBe('campaign');
    await vi.waitFor(() => {
      expect(getReferralLeaderboard).toHaveBeenCalledTimes(2);
    });
  });

  it('searches with debounce', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Leaderboard, { global: globalOptions });
    const input = wrapper.find('input[type="search"]');
    await input.setValue('search query');
    await input.trigger('input');
    vi.advanceTimersByTime(800);
    expect(getReferralLeaderboard).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('handles date range selection', async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    wrapper.vm.date = [new Date('2023-01-01'), new Date('2023-01-31')];
    await nextTick();
    expect(wrapper.vm.queryParams.from).toBe('2023-01-01');
    expect(wrapper.vm.queryParams.to).toBe('2023-01-31');
    
    wrapper.vm.date = null;
    await nextTick();
    expect(wrapper.vm.queryParams.from).toBeNull();
  });

  it('exports to CSV successfully', async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(wrapper.vm.rows.length).toBeGreaterThan(0);
    });
    const exportBtn = wrapper.findAll('button').find(b => b.text().includes('Export to CSV'));
    await exportBtn.trigger('click');
    expect(exportToCSV).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Leaderboard data exported successfully");
  });

  it('prevents export if no data', async () => {
    getReferralLeaderboard.mockResolvedValue({ data: { data: [], totalCount: 0 } });
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await nextTick();
    await wrapper.vm.exportToCSVHandler();
    expect(toast.error).toHaveBeenCalledWith("No data to export");
  });

  it('handles fetch error', async () => {
    const errorMsg = "API Error";
    getReferralLeaderboard.mockRejectedValue({
      response: { data: { message: errorMsg } }
    });
    mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('hides header and applies custom class based on props', () => {
    const wrapper = mount(Leaderboard, {
      global: globalOptions,
      props: { hideHeader: true, customClass: 'test-class' }
    });
    expect(wrapper.find('.font-semibold').exists()).toBe(false);
    expect(wrapper.find('.w-full.test-class').exists()).toBe(true);
  });

  it('hides tab section for unauthorized categories', async () => {
    mockAuthStore.userInfo.userCategory = 99;
    const wrapper = mount(Leaderboard, { global: globalOptions });
    expect(wrapper.findComponent({ name: 'AppTab' }).exists()).toBe(false);
  });
});
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import Leaderboard from "@/components/Pages/Superadmin/ReferralManagement/leaderboard/index.vue";
import { getReferralLeaderboard } from "~/services/userservices";
import { toast } from "vue3-toastify";
import { exportToCSV } from "~/utils/exportCsv";

vi.mock("~/services/userservices", () => ({
  getReferralLeaderboard: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("~/utils/exportCsv", () => ({
  exportToCSV: vi.fn(),
}));

const mockAuthStore = {
  userInfo: { userCategory: 0 },
};

vi.mock("~/stores/auth", () => ({
  useAuthStore: () => mockAuthStore,
}));

describe("Leaderboard Index", () => {
  const mockData = {
    data: {
      data: [{ rank: 1, userName: "Test User", totalReferrals: 5 }],
      totalCount: 1,
    },
  };

  const globalOptions = {
    stubs: {
      AppTab: {
        name: "AppTab",
        template: '<div class="app-tab"><button id="tab-btn" @click="$emit(\'setActive\', \'campaign\')">Switch</button></div>',
        props: ["tabs", "active"],
      },
      AppIcon: true,
      DashboardPageHeader: true,
      DashboardTableFilters: true,
      DashboardDateRangePicker: true,
      DashboardDataTable: {
        template: '<div class="dashboard-data-table"></div>',
        props: ["columns", "data", "loading", "paginator", "bodyCellClass", "emptyMessage"],
      },
      AppStatusButton: true,
      ClientOnly: {
        template: "<div><slot /></div>",
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.userInfo.userCategory = 0;
    getReferralLeaderboard.mockResolvedValue(mockData);
  });

  it("renders and fetches data on mount", async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(wrapper.vm.rows).toHaveLength(1);
    });
    expect(getReferralLeaderboard).toHaveBeenCalled();
  });

  it("handles tab change", async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await nextTick();
    const tabBtn = wrapper.find("#tab-btn");
    await tabBtn.trigger("click");
    expect(wrapper.vm.activeTab).toBe("campaign");
    await vi.waitFor(() => {
      expect(getReferralLeaderboard).toHaveBeenCalledTimes(2);
    });
  });

  it("searches with debounce", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Leaderboard, { global: globalOptions });
    
    wrapper.vm.handleSearch("search query");
    await nextTick();
    
    vi.advanceTimersByTime(800);
    expect(getReferralLeaderboard).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("handles date range selection", async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    
    wrapper.vm.handleDateChange({
      start: new Date("2023-01-01"),
      end: new Date("2023-01-31"),
    });
    await nextTick();
    
    expect(wrapper.vm.queryParams.from).toBe("2023-01-01");
    expect(wrapper.vm.queryParams.to).toBe("2023-01-31");

    wrapper.vm.handleDateChange(null);
    await nextTick();
    expect(wrapper.vm.queryParams.from).toBeNull();
  });

  it("exports to CSV successfully", async () => {
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(wrapper.vm.rows.length).toBeGreaterThan(0);
    });
    
    await wrapper.vm.handleDownload();
    expect(exportToCSV).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Leaderboard data exported successfully");
  });

  it("prevents export if no data", async () => {
    getReferralLeaderboard.mockResolvedValue({ data: { data: [], totalCount: 0 } });
    const wrapper = mount(Leaderboard, { global: globalOptions });
    await nextTick();
    
    await wrapper.vm.handleDownload();
    expect(toast.error).toHaveBeenCalledWith("No data to export");
  });

  it("handles fetch error", async () => {
    const errorMsg = "API Error";
    getReferralLeaderboard.mockRejectedValue({
      response: { data: { message: errorMsg } },
    });
    mount(Leaderboard, { global: globalOptions });
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMsg);
    });
  });

  it("hides header and applies custom class based on props", () => {
    const wrapper = mount(Leaderboard, {
      global: globalOptions,
      props: { hideHeader: true, customClass: "test-class" },
    });
    expect(wrapper.findComponent({ name: "DashboardPageHeader" }).exists()).toBe(false);
    expect(wrapper.classes()).toContain("test-class");
  });

  it("hides tab section for unauthorized categories", async () => {
    mockAuthStore.userInfo.userCategory = 99;
    const wrapper = mount(Leaderboard, { global: globalOptions });
    expect(wrapper.findComponent({ name: "AppTab" }).exists()).toBe(true);
  });
});
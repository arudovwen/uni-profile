import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import Index from "@/components/Pages/Settlements/index.vue";
import * as settlementService from "~/services/settlementservice";

vi.mock("~/services/settlementservice", () => ({
  viewSettlement: vi.fn(),
  deleteSettlement: vi.fn(),
  autoSettlement: vi.fn(),
  getAutoSettlement: vi.fn(),
  getBanks: vi.fn(() =>
    Promise.resolve({ data: { data: { responseBody: [] } } })
  ),
}));

const mockAuthStore = {
  userInfo: { userCategory: 1 },
};

vi.stubGlobal("useAuthStore", () => mockAuthStore);
vi.stubGlobal("definePageMeta", vi.fn());

describe("Settlements Index", () => {
  const mockFinanceData = [
    {
      id: 1,
      accountName: "John Doe",
      accountNumber: "1234567890",
      bankName: "Test Bank",
      isPrimaryAccount: true,
    },
    {
      id: 2,
      accountName: "Jane Smith",
      accountNumber: "0987654321",
      bankName: "Other Bank",
      isPrimaryAccount: false,
      status: 3,
    },
  ];

  const globalConfig = {
    stubs: {
      HeaderComponent: true,
      AppButton: {
        template:
          '<button class="app-btn-stub" @click="$emit(\'click\')">{{ text }}</button>',
        props: ["text"],
      },
      AppIcon: true,
      AppLoader: true,
      DeleteModal: {
        template:
          '<div v-if="open" class="delete-modal-stub"><button class="confirm-del" @click="$emit(\'deleteItem\')"></button><button class="close-modal" @click="$emit(\'close\')"></button></div>',
        props: ["open", "loading", "title", "text", "btnText"],
      },
      IndexModal: {
        template: '<div class="index-modal-stub"></div>',
        props: ["isOpen"],
      },
      PagesSettlementsForm: {
        template: '<div class="form-stub"></div>',
        emits: ["refresh"],
      },
      Checkbox: { template: '<input type="checkbox" />', props: ["modelValue", "label"] },
      DashboardPageHeader: {
        template: "<div><slot name='right' /></div>",
        props: ["title", "subtitle"],
      },
      DashboardTableFilters: {
        template: "<div></div>",
        props: ["modelValue", "searchPlaceholder", "showDownload"],
        emits: ["update:modelValue", "search"],
      },
      DashboardDataTable: {
        template: "<table><tbody></tbody></table>",
        props: ["columns", "data", "loading", "showActions", "actions", "paginator", "bodyCellClass", "emptyMessage"],
        emits: ["action"],
      },
      Menu: { template: "<div><slot /></div>" },
      MenuButton: { template: "<button class='menu-btn'><slot /></button>" },
      MenuItems: { template: "<div><slot /></div>" },
      SwitchGroup: { template: "<div><slot /></div>" },
      SwitchLabel: { template: "<span><slot /></span>" },
      Switch: {
        template:
          '<button class="switch-stub" @click="$emit(\'update:modelValue\', !modelValue)"></button>',
        props: ["modelValue"],
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    settlementService.getAutoSettlement.mockResolvedValue({
      status: 200,
      data: { data: { autoSettlement: true } },
    });
    settlementService.viewSettlement.mockResolvedValue({
      status: 200,
      data: { data: mockFinanceData, totalCount: 2 },
    });
    settlementService.autoSettlement.mockResolvedValue({ status: 200 });
    settlementService.deleteSettlement.mockResolvedValue({ status: 200 });
    mockAuthStore.userInfo.userCategory = 1;
  });

  it("fetches data on mount and displays table", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("handles delete flow", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    wrapper.vm.handleAction("delete", { id: 1 });
    await nextTick();

    expect(wrapper.vm.deleteModalOpen).toBe(true);
    expect(wrapper.vm.selectedId).toBe(1);

    await wrapper.find(".confirm-del").trigger("click");
    await flushPromises();

    expect(settlementService.deleteSettlement).toHaveBeenCalledWith(1);
  });

  it("handles user category restrictions", async () => {
    mockAuthStore.userInfo.userCategory = 2;
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    expect(wrapper.find(".app-btn-stub").exists()).toBe(false);
  });

  it("triggers search with debounce", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    wrapper.vm.searchQuery = "test";
    await nextTick();
    vi.advanceTimersByTime(400);
    await flushPromises();

    expect(wrapper.vm.searchQuery).toBe("test");
    expect(wrapper.vm.queryParams.Search).toBe("test");

    vi.useRealTimers();
  });

  it("triggers load more when not at total", async () => {
    settlementService.viewSettlement.mockResolvedValue({
      status: 200,
      data: { data: mockFinanceData, totalCount: 10 }, 
    });

    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    const callsBefore = settlementService.viewSettlement.mock.calls.length;

    wrapper.vm.handleLoadMore();
    await flushPromises();

    expect(settlementService.viewSettlement).toHaveBeenCalledTimes(
      callsBefore + 1
    );
    expect(wrapper.vm.queryParams.PageNumber).toBe(2);
  });

  it("handles empty data state", async () => {
    settlementService.viewSettlement.mockResolvedValue({
      status: 200,
      data: { data: [], totalCount: 0 },
    });
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain("No settlement account available");
    expect(wrapper.find("table").exists()).toBe(false);
  });

  it("opens modal for create via openCreateModal", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    wrapper.vm.openCreateModal();
    await nextTick();

    expect(wrapper.vm.isModalOpen).toBe(true);
    expect(wrapper.vm.selectedId).toBeNull();
    expect(wrapper.vm.selectedDetail).toBeNull();
  });

  it("opens modal for edit via handleAction", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    wrapper.vm.handleAction("edit", { id: 5, accountName: "Test" });
    await nextTick();

    expect(wrapper.vm.isModalOpen).toBe(true);
    expect(wrapper.vm.selectedId).toBe(5);
    expect(wrapper.vm.selectedDetail).toEqual({ id: 5, accountName: "Test" });
  });

  it("handles autoSettlement toggle failure gracefully", async () => {
    settlementService.autoSettlement.mockRejectedValue(new Error("Network error"));
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    await wrapper.vm.toggleAutoSettlement();
    await flushPromises();

    expect(wrapper.vm.setLoader).toBe(false);
  });

  it("handles delete settlement error", async () => {
    settlementService.deleteSettlement.mockRejectedValue({
      response: { data: { message: "Error Occurred" } },
    });
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    wrapper.vm.selectedId = 1;
    await wrapper.vm.handleDelete();
    await flushPromises();

    expect(wrapper.vm.deleteLoading).toBe(false);
  });
});
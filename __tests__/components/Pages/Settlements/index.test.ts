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
  getBanks: vi.fn(() => Promise.resolve({ data: { data: { responseBody: [] } } }))
}));

const mockAuthStore = {
  userInfo: { userCategory: 1 }
};

vi.stubGlobal('useAuthStore', () => mockAuthStore);
vi.stubGlobal('definePageMeta', vi.fn());

describe("Settlements Index", () => {
  const mockFinanceData = [
    { id: 1, accountName: "John Doe", accountNumber: "1234567890", bankName: "Test Bank", isPrimaryAccount: true },
    { id: 2, accountName: "Jane Smith", accountNumber: "0987654321", bankName: "Other Bank", isPrimaryAccount: false, status: 3 }
  ];

  const globalConfig = {
    stubs: {
      HeaderComponent: true,
      AppButton: {
        template: '<button class="app-btn-stub" @click="$emit(\'click\')">{{ text }}</button>',
        props: ["text"]
      },
      AppIcon: true,
      AppLoader: true,
      EmptyData: true,
      DeleteModal: {
        template: '<div v-if="open" class="delete-modal-stub"><button class="confirm-del" @click="$emit(\'deleteItem\')"></button><button class="close-modal" @click="$emit(\'close\')"></button></div>',
        props: ["open"]
      },
      IndexModal: {
        template: '<div class="index-modal-stub"><slot name="content" /></div>',
        props: ["isOpen"]
      },
      PagesSettlementsForm: {
        template: '<div class="form-stub"></div>',
        emits: ['refresh']
      },
      Menu: { template: '<div><slot /></div>' },
      MenuButton: { template: '<button class="menu-btn"><slot /></button>' },
      MenuItems: { template: '<div><slot /></div>' },
      SwitchGroup: { template: '<div><slot /></div>' },
      SwitchLabel: { template: '<span><slot /></span>' },
      Switch: {
        template: '<button class="switch-stub" @click="$emit(\'update:modelValue\', !modelValue)"></button>',
        props: ["modelValue"]
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    settlementService.getAutoSettlement.mockResolvedValue({ status: 200, data: { data: { autoSettlement: true } } });
    settlementService.viewSettlement.mockResolvedValue({ status: 200, data: { data: mockFinanceData, totalCount: 2 } });
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

  it("handles delete flow and handles error variables", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    wrapper.vm.deleteRequest(1);
    await nextTick();
    await wrapper.find(".confirm-del").trigger("click");
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
    wrapper.vm.queryParams.Search = "test";
    await nextTick();
    vi.advanceTimersByTime(800);
    expect(settlementService.viewSettlement).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("triggers pagination and sort watchers", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    wrapper.vm.queryParams.SortOrder = "desc";
    await nextTick();
    expect(settlementService.viewSettlement).toHaveBeenCalledTimes(3);
  });

  it("handles empty data state", async () => {
    settlementService.viewSettlement.mockResolvedValue({ status: 200, data: { data: [] } });
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    expect(wrapper.findComponent({ name: "EmptyData" }).exists()).toBe(true);
  });

  it("covers openRequest method and loader states", async () => {
    const wrapper = mount(Index, { global: globalConfig });
    wrapper.vm.openRequest({ id: 5 });
    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.vm.detail.id).toBe(5);
  });

  it("handles autoSettlement service failure", async () => {
    settlementService.autoSettlement.mockRejectedValue(new Error());
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    wrapper.vm.handleAutoSettlement();
    await flushPromises();
    expect(wrapper.vm.setLoader).toBe(false);
  });

  it("handles delete settlement error", async () => {
    settlementService.deleteSettlement.mockRejectedValue({
      response: { data: { message: "Error Occurred" } }
    });
    const wrapper = mount(Index, { global: globalConfig });
    wrapper.vm.id = 1;
    wrapper.vm.handleDelete();
    await flushPromises();
    expect(wrapper.vm.setLoader).toBe(false);
  });
});
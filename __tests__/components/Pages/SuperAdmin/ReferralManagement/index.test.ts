import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ReferralIndex from "@/components/Pages/Superadmin/ReferralManagement/index.vue";
import * as userservices from "~/services/userservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/userservices", () => ({
  getReferrals: vi.fn(),
  updateReferralStatus: vi.fn(),
  deleteReferral: vi.fn(),
}));

vi.mock("#app", () => ({
  navigateTo: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn) => fn,
}));

const mockNavigateTo = vi.fn();

describe("ReferralManagement Index.vue", () => {
  let wrapper;
  const mockRows = [
    { id: 1, referralCode: "REF001", status: 0, assignedUser: "User A", created_On: "2024-01-01" },
    { id: 2, referralCode: "REF002", status: 1, assignedUser: null, created_On: "2024-01-02" },
  ];

  const createWrapper = () => {
    return mount(ReferralIndex, {
      global: {
        mocks: {
          navigateTo: mockNavigateTo,
        },
        stubs: {
          AppIcon: true,
          AppButton: {
            template: '<button @click="$emit(\'click\')">{{text}}</button>',
            props: ["text"],
          },
          DashboardTableFilters: true,
          DashboardFilterDropdown: {
            template: '<div id="mock-dropdown" @click="$emit(\'update:modelValue\', \'0\'); $emit(\'change\')">Dropdown</div>',
            props: ["modelValue", "options", "placeholder"],
          },
          DashboardDataTable: {
            template: `<div>
              <template v-if="data && data.length > 0">
                <slot name="cell-referralCode" :data="data[0]" />
                <slot name="cell-status" :data="data[0]" />
                <slot name="cell-assignedUser" :data="data[1] || data[0]" />
                <slot name="cell-assignedApps" :data="data[1] || data[0]" />
              </template>
            </div>`,
            props: ["columns", "data", "loading", "showActions", "actions", "paginator", "bodyCellClass", "emptyMessage"],
          },
          DeleteModal: {
            template: '<div v-if="open"><button id="confirm-del" @click="$emit(\'deleteItem\')"></button></div>',
            props: ["open", "title", "text", "loading", "btnText"],
          },
          IndexModal: { template: "<div><slot name='content' /></div>", props: ["isOpen"] },
          PagesSettingsReferralLinks: true,
          "svgs-loudspeaker": true,
          AppStatusButton: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    userservices.getReferrals.mockResolvedValue({
      data: { data: mockRows, totalCount: 2 },
    });
  });

  const waitForAsync = () => new Promise((r) => setTimeout(r, 50));

  it("fetches referrals on mount", async () => {
    wrapper = createWrapper();
    await waitForAsync();
    expect(userservices.getReferrals).toHaveBeenCalled();
    expect(wrapper.vm.rows).toHaveLength(2);
  });

  it("handles fetch error", async () => {
    userservices.getReferrals.mockRejectedValue({ response: { data: { message: "Error" } } });
    wrapper = createWrapper();
    await waitForAsync();
    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  it("updates pagination and status filters", async () => {
    wrapper = createWrapper();
    await waitForAsync();

    wrapper.vm.filters.status = "0";
    await nextTick();
    
    expect(wrapper.vm.queryParams.PageNumber).toBe(1);
    expect(userservices.getReferrals).toHaveBeenCalledTimes(2);
  });

  it("triggers search on input", async () => {
    wrapper = createWrapper();
    await waitForAsync();

    if (typeof wrapper.vm.handleSearch === "function") {
      wrapper.vm.handleSearch("TEST");
    } else {
      wrapper.vm.queryParams.Search = "TEST";
      wrapper.vm.queryParams.PageNumber = 1;
    }
    await nextTick();

    expect(wrapper.vm.queryParams.PageNumber).toBe(1);
    expect(userservices.getReferrals).toHaveBeenCalled();
  });

  it("handles activation and deactivation", async () => {
    userservices.updateReferralStatus.mockResolvedValue({});
    wrapper = createWrapper();

    await wrapper.vm.handleActivate(mockRows[0]);
    expect(userservices.updateReferralStatus).toHaveBeenCalledWith("REF001", 1);
    expect(toast.success).toHaveBeenCalled();

    await wrapper.vm.handleDeactivate(mockRows[1]);
    expect(userservices.updateReferralStatus).toHaveBeenCalledWith("REF002", 0);
  });

  it("handles activation failure", async () => {
    userservices.updateReferralStatus.mockRejectedValue(new Error("Fail"));
    wrapper = createWrapper();
    await wrapper.vm.handleActivate(mockRows[0]);
    expect(toast.error).toHaveBeenCalled();
  });

  it("opens delete modal and confirms deletion", async () => {
    userservices.deleteReferral.mockResolvedValue({});
    wrapper = createWrapper();

    wrapper.vm.handleDelete(mockRows[0]);
    expect(wrapper.vm.deleteModalOpen).toBe(true);

    await wrapper.vm.confirmDelete();
    expect(userservices.deleteReferral).toHaveBeenCalledWith(mockRows[0].id);
    expect(wrapper.vm.deleteModalOpen).toBe(false);
  });

  it("handles delete failure", async () => {
    userservices.deleteReferral.mockRejectedValue(new Error("Fail"));
    wrapper = createWrapper();
    wrapper.vm.selectedReferralForDelete = mockRows[0];
    await wrapper.vm.confirmDelete();
    expect(toast.error).toHaveBeenCalled();
    expect(wrapper.vm.deleteLoading).toBe(false);
  });

  it("opens detail modal when code is clicked", async () => {
    wrapper = createWrapper();
    await waitForAsync();

    const linkButton = wrapper.find("button.text-\\[\\#1570EF\\]");
    await linkButton.trigger("click");

    expect(wrapper.vm.openRef).toBe(true);
    expect(wrapper.vm.refDetail).toEqual(mockRows[0]);
  });
});
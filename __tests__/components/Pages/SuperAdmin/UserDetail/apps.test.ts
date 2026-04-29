import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Apps from "@/components/Pages/Superadmin/UserDetail/apps.vue";
import * as userServices from "~/services/userservices";
import { toast } from "vue3-toastify";
import { nextTick } from "vue";

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn) => fn,
}));

vi.mock("~/services/userservices", () => ({
  getSubApps: vi.fn(),
  adminToggleAccess: vi.fn(),
}));

const mockAuthStore = {
  userInfo: { userCategory: 3 }
};

vi.stubGlobal("useAuthStore", () => mockAuthStore);

describe("UserDetail Apps Component", () => {
  const mockUserData = { value: { contactEmail: "test@example.com" } };
  const mockMyUserApps = { value: ["APP_01"] };
  const mockGetUserData = vi.fn();

  const globalConfig = {
    stubs: {
      CustomTable: {
        props: ["rows", "columns", "isLoading"],
        template: `
          <div>
            <div v-for="row in rows" :key="row.id">
              <slot name="table-row-name" :row="row" />
              <slot name="table-row-isDisabled" :row="row" />
              <slot name="table-row-action" :row="row" />
            </div>
          </div>
        `,
      },
      DeleteModal: {
        props: ["open"],
        template: '<div v-if="open" class="delete-modal-stub"><button class="confirm-btn" @click="$emit(\'deleteItem\')"></button></div>'
      },
      ActionModal: {
        props: ["open"],
        template: '<div v-if="open" class="action-modal-stub"><button class="action-btn" @click="$emit(\'actionItem\')"></button></div>'
      },
      IndexModal: {
        props: ["isOpen"],
        template: '<div v-if="isOpen" class="index-modal-stub"><slot name="content" /></div>'
      },
      UpdateForm: {
        name: "UpdateForm",
        template: '<div class="update-form-stub"></div>'
      },
      AppIcon: true,
      AppStatusButton: true,
      Menu: { template: '<div><slot /></div>' },
      MenuButton: { template: '<button class="menu-btn-stub"><slot /></button>' },
      MenuItems: { template: '<div><slot /></div>' },
      MenuItem: { template: '<div><slot /></div>' },
      Float: { template: '<div><slot /></div>' },
    },
    provide: {
      myUserApps: mockMyUserApps,
      userData: mockUserData,
      getUserData: mockGetUserData,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userServices.getSubApps).mockResolvedValue({
      status: 200,
      data: { data: [{ id: 1, name: "App 1", code: "APP_01", iconUrl: "icon.png" }] },
    });
  });

  it("fetches apps on mount and maps isDisabled", async () => {
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    expect(userServices.getSubApps).toHaveBeenCalled();
    expect(wrapper.vm.filteredRow[0].isDisabled).toBe(true);
  });

  it("handles getSubApps error", async () => {
    vi.mocked(userServices.getSubApps).mockRejectedValueOnce(new Error("Failed"));
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.setLoader).toBe(false);
  });

  it("opens revoke modal when clicking Revoke access", async () => {
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    const revokeBtn = wrapper.find('button[type="button"]');
    await revokeBtn.trigger("click");
    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.detail.id).toBe(1);
  });

  it("triggers handleAccess successfully for revoke", async () => {
    vi.mocked(userServices.adminToggleAccess).mockResolvedValue({ status: 200 });
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    wrapper.vm.detail = { code: "APP_01" };
    wrapper.vm.open = true;
    await nextTick();
    
    const confirmBtn = wrapper.find(".delete-modal-stub .confirm-btn");
    await confirmBtn.trigger("click");
    
    expect(userServices.adminToggleAccess).toHaveBeenCalled();
    await flushPromises();
    expect(toast.success).toHaveBeenCalledWith("Status updated");
    expect(mockGetUserData).toHaveBeenCalled();
  });

  it("triggers handleAccess successfully for enable", async () => {
    vi.mocked(userServices.adminToggleAccess).mockResolvedValue({ status: 200 });
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    wrapper.vm.detail = { code: "APP_01" };
    wrapper.vm.isOpen = true;
    await nextTick();
    
    await wrapper.find(".action-modal-stub .action-btn").trigger("click");
    await flushPromises();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("handles adminToggleAccess error", async () => {
    vi.mocked(userServices.adminToggleAccess).mockRejectedValue({
      response: { data: { message: "Error Occurred" } }
    });
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    wrapper.vm.detail = { code: "APP_01" };
    await wrapper.vm.handleAccess();
    await flushPromises();
    expect(toast.error).toHaveBeenCalledWith("Error Occurred");
  });

  it("triggers getData when queryParams change", async () => {
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    wrapper.vm.queryParams.Search = "new search";
    await nextTick();
    expect(userServices.getSubApps).toHaveBeenCalledTimes(2);
    
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    expect(userServices.getSubApps).toHaveBeenCalledTimes(3);
  });

  it("updates list when update form emits refresh", async () => {
    const wrapper = mount(Apps, { global: globalConfig });
    wrapper.vm.isUpdateOpen = true;
    await nextTick();
    const form = wrapper.findComponent({ name: "UpdateForm" });
    await form.vm.$emit("refresh");
    expect(userServices.getSubApps).toHaveBeenCalledTimes(2);
  });

  it("closes update modal when form emits close", async () => {
    const wrapper = mount(Apps, { global: globalConfig });
    wrapper.vm.isUpdateOpen = true;
    await nextTick();
    const form = wrapper.findComponent({ name: "UpdateForm" });
    await form.vm.$emit("close");
    expect(wrapper.vm.isUpdateOpen).toBe(false);
  });

  it("renders different menu options based on userCategory", async () => {
    mockAuthStore.userInfo.userCategory = 1;
    const wrapper = mount(Apps, { global: globalConfig });
    await flushPromises();
    const buttons = wrapper.findAll('button.py-2');
    expect(buttons.length).toBe(2);
  });
});
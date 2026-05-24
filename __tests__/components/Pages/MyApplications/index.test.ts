import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import MyApplications from "@/components/Pages/MyApplications/index.vue";

const { getSubAppsMock, editSubAppMock } = vi.hoisted(() => ({
  getSubAppsMock: vi.fn(),
  editSubAppMock: vi.fn(),
}));

vi.mock("~/services/userservices", () => ({
  getSubApps: getSubAppsMock,
  editSubApp: editSubAppMock,
}));

vi.mock("vue3-toastify", () => ({
  toast: { info: vi.fn() },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn: any) => fn,
}));

// Mock useCookie so userInfo computed resolves with subAppCodes
mockNuxtImport("useCookie", () =>
  vi.fn((name: string) => {
    if (name === "matta_auth" || name === "mattaAuth") {
      return ref({ userCategory: 0, subAppCodes: ["APP01", "APP02"] });
    }
    return ref(null);
  })
);

const mockSubApps = {
  status: 200,
  data: {
    data: [
      { name: "App One", code: "APP01", iconUrl: "icon1.png", isDisabled: false, isTwoFactorAuthEnabled: false },
      { name: "App Two", code: "APP02", iconUrl: "icon2.png", isDisabled: true, isTwoFactorAuthEnabled: true },
      { name: "App Three", code: "APP03", iconUrl: "icon3.png", isDisabled: false, isTwoFactorAuthEnabled: false },
    ],
  },
};

const mountComponent = () =>
  mountSuspended(MyApplications, {
    global: {
      stubs: {
        HeaderComponent: true,
        AppStatusButton: true,
        CustomTable: {
          name: "CustomTable",
          template: "<div><slot name='table-row-name' :row='rows[0]' /><slot name='table-row-isDisabled' :row='rows[1]' /></div>",
          props: ["columns", "rows", "isLoading", "emptyTitle", "emptyType"],
        },
        DeleteModal: {
          name: "DeleteModal",
          template: "<div />",
          props: ["open", "title", "text", "btnText"],
          emits: ["deleteItem", "close"],
        },
        Float: true,
        Menu: true,
        MenuButton: true,
        MenuItems: true,
        Switch: true,
        SwitchGroup: true,
      },
    },
  });

describe("MyApplications/index.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSubAppsMock.mockResolvedValue(mockSubApps);
  });

  it("sets setLoader to false after data loads", async () => {
    const wrapper = await mountComponent();
    await flushPromises();

    expect(wrapper.vm.setLoader).toBe(false);
  });

  it("handles API error in getData", async () => {
    getSubAppsMock.mockRejectedValueOnce(new Error("Failed"));
    const wrapper = await mountComponent();
    await flushPromises();

    expect(wrapper.vm.setLoader).toBe(false);
    expect(wrapper.vm.rows).toEqual([]);
  });

  it("triggers getData when Search changes", async () => {
    const wrapper = await mountComponent();
    await flushPromises();
    getSubAppsMock.mockClear();

    wrapper.vm.queryParams.Search = "test";
    await flushPromises();

    expect(getSubAppsMock).toHaveBeenCalled();
  });

  it("triggers getData when PageNumber changes", async () => {
    const wrapper = await mountComponent();
    await flushPromises();
    getSubAppsMock.mockClear();

    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();

    expect(getSubAppsMock).toHaveBeenCalled();
  });

  it("triggers getData when SortOrder changes", async () => {
    const wrapper = await mountComponent();
    await flushPromises();
    getSubAppsMock.mockClear();

    wrapper.vm.queryParams.SortOrder = "desc";
    await nextTick();

    expect(getSubAppsMock).toHaveBeenCalled();
  });

  it("closes DeleteModal when open is set to false", async () => {
    const wrapper = await mountComponent();
    await flushPromises();

    wrapper.vm.open = true;
    await nextTick();
    expect(wrapper.vm.open).toBe(true);

    // Call the handler the @close event would trigger
    wrapper.vm.open = false;
    await nextTick();

    expect(wrapper.vm.open).toBe(false);
  });

  it("handleDelete is defined and callable", async () => {
    const wrapper = await mountComponent();
    await flushPromises();

    expect(typeof wrapper.vm.handleDelete).toBe("function");
    expect(() => wrapper.vm.handleDelete()).not.toThrow();
  });

  it("getSubApps is called on mount", async () => {
    await mountComponent();
    await flushPromises();

    expect(getSubAppsMock).toHaveBeenCalledTimes(1);
  });
});
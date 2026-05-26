import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { reactive, nextTick } from "vue";
import AppHeader from "@/components/AppHeader.vue";

const mockRoute = reactive({ path: "/", query: { tab: undefined as string | undefined } });
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ push: vi.fn() }),
}));

vi.stubGlobal("useEncryption", () => ({
  decrypt: vi.fn((val: string) => val),
}));

const loggedUser = reactive({
  firstName: "John",
  lastName: "Doe",
  email: "john@doe.com",
  photo: "",
  avatar: "",
});

const userInfo = reactive({ userCategory: 1 });

const authStoreState = {
  loggedUser,
  userInfo,
  logOut: vi.fn(),
};

vi.mock("#imports", () => ({
  useAuthStore: () => authStoreState,
  useRoute: () => mockRoute,
  useRouter: () => ({ push: vi.fn() }),
  useEncryption: () => ({ decrypt: (v: string) => v }),
}));

vi.stubGlobal("useAuthStore", () => authStoreState);

const stubs = {
  NuxtLink: { template: "<a><slot /></a>" },
  AuthLogo: { template: "<div data-test='logo'>Logo</div>" },
  DashboardNavIcon: { props: ["name", "active"], template: "<span />" },
  PermissionGuard: { props: ["categories"], template: "<div><slot /></div>" },
};

describe("AppHeader.vue", () => {
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.path = "/";
    mockRoute.query.tab = undefined;

    loggedUser.firstName = "John";
    loggedUser.lastName = "Doe";
    loggedUser.email = "john@doe.com";
    loggedUser.photo = "";
    loggedUser.avatar = "";
    userInfo.userCategory = 1;

    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
  });

  it("renders the logo element via AuthLogo layout path markup", () => {
    const wrapper = mount(AppHeader, { global: { stubs } });
    expect(wrapper.find("[data-test='logo']").exists()).toBe(true);
  });

  it("handles empty names by defaulting initials fallback gracefully", async () => {
    loggedUser.firstName = "";
    loggedUser.lastName = "";
    const wrapper = mount(AppHeader, { global: { stubs } });
    await nextTick();
    expect(wrapper.vm.userInitial).toBe("U");
  });

  it("toggles the user profile menu open state when dropdown button is clicked", async () => {
    const wrapper = mount(AppHeader, { global: { stubs } });

    expect(wrapper.vm.isUserMenuOpen).toBe(false);

    await wrapper.find("button[type='button']").trigger("click");
    expect(wrapper.vm.isUserMenuOpen).toBe(true);

    await wrapper.find("button[type='button']").trigger("click");
    expect(wrapper.vm.isUserMenuOpen).toBe(false);
  });

  it("resolves default path mappings when user is not superadmin", () => {
    const wrapper = mount(AppHeader, { global: { stubs } });

    expect(wrapper.vm.isSuperadmin).toBe(false);
    expect(wrapper.vm.getTabPath("apps")).toBe("/dashboard/apps");
    expect(wrapper.vm.getTabPath("settings")).toBe("/dashboard/settings");
  });

  it("registers document outside-click click wrapper hook on layout mount", () => {
    mount(AppHeader, { global: { stubs } });
    expect(addEventListenerSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("cleans up layout listeners cleanly on design unmount execution blocks", () => {
    const wrapper = mount(AppHeader, { global: { stubs } });
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });
});
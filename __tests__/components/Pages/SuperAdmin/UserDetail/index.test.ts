import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn(),
}));

vi.mock("~/services/userservices", () => ({
  getSingleInvite: vi.fn(() => Promise.resolve({ status: 200, data: { data: {} } })),
}));

import * as settingServices from "~/services/settingservices";

const mockAuthStore = { userInfo: { userCategory: 1 } };
vi.stubGlobal("useAuthStore", () => mockAuthStore);
vi.stubGlobal("useRoute", () => ({
  path: "/user-management/user-detail/user-456/profile",
  query: { name: "John Doe" },
  params: { id: "user-456" },
}));

vi.mock("virtual:public?%2Fimages%2Fenable-user.svg", () => ({ default: "mock-enable-user.svg" }));
vi.mock("virtual:public?%2Fimages%2Frevoke-user.svg", () => ({ default: "mock-revoke-user.svg" }));

import UserDetail from "@/components/Pages/Superadmin/UserDetail/index.vue";

describe("UserDetail", () => {
  const globalConfig = {
    stubs: {
      GoBack: { template: '<div class="go-back-stub" />' },
      HeaderComponent: {
        props: ["title"],
        template: '<div class="header-stub">{{ title }}</div>',
      },
      AppTab: {
        props: ["tabs", "active"],
        emits: ["setActive"],
        template:
          '<div class="app-tab-stub"><button v-for="tab in tabs" :key="tab.key" :class="\'tab-\' + tab.key" @click="$emit(\'setActive\', tab.key)">{{ tab.title }}</button></div>',
      },
      PagesUsersUserDetailInformation: {
        template: '<div class="user-information-stub" />',
      },
      PagesSuperadminUserDetailApps: {
        template: '<div class="superadmin-apps-stub" />',
      },
      PagesUsersUserDetailApps: {
        template: '<div class="user-apps-stub" />',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.userInfo = { userCategory: 1 };
    vi.mocked(settingServices.getUserDetail).mockResolvedValue({
      status: 200,
      data: {
        data: {
          appCodes: ["app1", "app2"],
          name: "John Doe",
          email: "john@test.com",
        },
      },
    } as any);
  });

  it("sets myUserApps and userData from API response", async () => {
    const wrapper = mount(UserDetail, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.myUserApps).toEqual(["app1", "app2"]);
    expect(wrapper.vm.userData).toMatchObject({ name: "John Doe" });
  });

  it("provides myUserApps, getUserData and userData", async () => {
    const wrapper = mount(UserDetail, { global: globalConfig });
    await flushPromises();

    const provides = (wrapper.vm.$ as any).provides;
    expect(provides).toHaveProperty("myUserApps");
    expect(provides).toHaveProperty("getUserData");
    expect(provides).toHaveProperty("userData");
  });

  it("provided getUserData re-fetches and updates state", async () => {
    const wrapper = mount(UserDetail, { global: globalConfig });
    await flushPromises();

    vi.mocked(settingServices.getUserDetail).mockResolvedValueOnce({
      status: 200,
      data: { data: { appCodes: ["app3"], name: "Updated" } },
    } as any);

    await wrapper.vm.getUserData();
    await flushPromises();

    expect(wrapper.vm.myUserApps).toEqual(["app3"]);
    expect(wrapper.vm.userData.name).toBe("Updated");
  });

  it("renders both tabs in AppTab", async () => {
    const wrapper = mount(UserDetail, { global: globalConfig });
    await flushPromises();

    expect(wrapper.find(".tab-profile").exists()).toBe(true);
    expect(wrapper.find(".tab-apps").exists()).toBe(true);
  });

  it("active prop defaults to profile", async () => {
    const wrapper = mount(UserDetail, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.active).toBe("profile");
  });
});
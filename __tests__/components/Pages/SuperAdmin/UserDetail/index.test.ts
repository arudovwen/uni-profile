import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted by Vitest automatically, but the import of the mocked
// module must come AFTER this call to guarantee the mock is in place first.
vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn(),
}));

// Import the mocked module after vi.mock so we get the mocked version
import * as settingServices from "~/services/settingservices";

const mockAuthStore = { userInfo: { userCategory: 1 } };
vi.stubGlobal("useAuthStore", () => mockAuthStore);
vi.stubGlobal("useRoute", () => ({
  query: { name: "John Doe" },
  params: { id: "user-456" },
}));

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

    // getUserData now returns a Promise, so we can await it directly
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
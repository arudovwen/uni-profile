import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AppUserSelector from "@/components/Pages/Superadmin/Users/AppUserSelector.vue";

const mockAppList = [
  { id: 1, name: "App One", code: "A1", iconUrl: "icon1.png" },
  { id: 2, name: "App Two", code: "A2", iconUrl: "icon2.png" },
];

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    appList: mockAppList,
  }),
}));

vi.stubGlobal("useAuthStore", () => ({
  appList: mockAppList,
}));

describe("AppUserSelector.vue", () => {
  let wrapper;

  const createWrapper = async () => {
    const w = mount(AppUserSelector, {
      global: {
        stubs: {
          SelectVueSelect: {
            name: "SelectVueSelect",
            template: '<div class="v-select-stub">{{modelValue}}</div>',
            props: ["modelValue", "options", "disabled"],
          },
        },
      },
    });
    await nextTick();
    return w;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes apps from authStore on mount", async () => {
    wrapper = await createWrapper();
    expect(wrapper.vm.apps.length).toBe(2);
    expect(wrapper.vm.apps[0].appCode).toBe(false);
    expect(wrapper.vm.apps[0].name).toBe("App One");
  });

  it("updates selectedApps when a checkbox is toggled", async () => {
    wrapper = await createWrapper();
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setChecked(true);
    await nextTick();
    expect(wrapper.vm.selectedApps.length).toBe(1);
    expect(wrapper.vm.selectedApps[0].appCode).toBe("A1");
  });

  it("emits getData when selectedApps change", async () => {
    wrapper = await createWrapper();
    wrapper.vm.apps[0].appCode = true;
    await nextTick();
    await nextTick();
    expect(wrapper.emitted("getData")).toBeTruthy();
    expect(wrapper.emitted("getData")[0][0][0].appCode).toBe("A1");
  });

  it("renders app details correctly", async () => {
    wrapper = await createWrapper();
    const listItem = wrapper.find("li");
    expect(listItem.text()).toContain("App One");
    expect(listItem.find("img").attributes("src")).toBe("icon1.png");
  });

  it("filters out unselected apps from selectedApps", async () => {
    wrapper = await createWrapper();
    wrapper.vm.apps[0].appCode = true;
    wrapper.vm.apps[1].appCode = false;
    await nextTick();
    expect(wrapper.vm.selectedApps.length).toBe(1);
    expect(wrapper.vm.selectedApps[0].appCode).toBe("A1");
  });
});
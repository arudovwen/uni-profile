import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, reactive, nextTick } from "vue";
import AppSideMenu from "@/components/AppSideMenu.vue";

// Single shared reactive store — mutate this per test
const authStoreState = reactive({
  isLoggedIn: false,
  userInfo: {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@example.com",
  },
});

vi.mock("~/services/authservices", () => ({
  logOut: vi.fn(),
}));

// Stub once at module level so the component always gets this object
vi.stubGlobal("useAuthStore", () => authStoreState);

const mockRoute = ref({ path: "/" });
vi.stubGlobal("useRoute", () => mockRoute.value);

vi.stubGlobal("navigation", [
  { name: "Home", url: "/", icon: "home", key: "home" },
  { name: "Logout", url: "/logout", icon: "logout", key: "sign-out" },
]);

const DialogStub = {
  template: '<div class="dialog-stub"><slot /></div>',
  emits: ["close"],
};

const baseStubs = {
  TransitionRoot: { template: "<div><slot /></div>" },
  TransitionChild: { template: "<div><slot /></div>" },
  Dialog: DialogStub,
  DialogPanel: { template: "<div><slot /></div>" },
  AppIcon: { template: "<span></span>" },
  AppButton: { template: '<button><slot /></button>' },
  MenuMobile: { template: "<div></div>" },
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ["to"] },
};

describe("AppSideMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.value = { path: "/" };
    // Reset store to logged-out state before every test
    authStoreState.isLoggedIn = false;
  });

  const mountMenu = (openRef: ReturnType<typeof ref>) =>
    mount(AppSideMenu, {
      global: {
        stubs: baseStubs,
        provide: { open: openRef },
      },
    });

  it("renders guest view when not logged in", () => {
    const open = ref(true);
    const wrapper = mountMenu(open);

    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.text()).toContain("Become a Supplier");
  });

  it("closes the menu when close button is clicked", async () => {
    const open = ref(true);
    const wrapper = mountMenu(open);

    await wrapper.find('button[type="button"]').trigger("click");
    expect(open.value).toBe(false);
  });

  it("closes the menu when dialog emits close", async () => {
    const open = ref(true);
    const wrapper = mountMenu(open);

    await wrapper.findComponent(DialogStub).vm.$emit("close");
    expect(open.value).toBe(false);
  });

  it("updates storeOpen when route changes", async () => {
    const open = ref(true);
    const wrapper = mountMenu(open);

    mockRoute.value = { path: "/new-path" };
    await nextTick();
    expect(wrapper.vm.storeOpen).toBe(false);
  });
});
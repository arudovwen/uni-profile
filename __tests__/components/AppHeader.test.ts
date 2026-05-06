import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import AppHeader from "@/components/AppHeader.vue";

const route = ref({ path: "/" });

vi.mock("vue-router", () => ({
  useRouter: () => ({
    currentRoute: route,
  }),
}));

vi.mock("@vueuse/core", () => ({
  useThrottleFn: (fn: any) => fn,
}));

const userInfo = {
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  email: "john@doe.com",
};

global.useAuthStore = () => ({
  userInfo,
});

const stubs = {
  AppLogo: { template: "<div data-test='logo' />" },
  Textinput: { template: "<input />" },
  AppMenu: { template: "<div data-test='menu' />" },
  AppIcon: { template: "<span />" },
  MultiApps: { template: "<div data-test='multiapps' />" },
  ModalSide: {
    props: ["isOpen"],
    emits: ["toggle-popup"],
    template: "<div><slot name='content' /></div>",
  },
  Menu: { template: "<div><slot /></div>" },
  MenuButton: { template: "<button><slot /></button>" },
  MenuItems: { template: "<div><slot /></div>" },
  MenuItem: {
    template: "<div><slot :close='() => {}' :active='false' :disabled='false' /></div>",
  },
};

describe("AppHeader.vue", () => {
  let addEventListenerSpy: any;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
  });

  it("renders logo when hideLogo is false", () => {
    const wrapper = mount(AppHeader, {
      props: { hideLogo: false },
      global: { stubs },
    });
    expect(wrapper.find("[data-test='logo']").exists()).toBe(true);
  });

  it("does not render logo when hideLogo is true", () => {
    const wrapper = mount(AppHeader, {
      props: { hideLogo: true },
      global: { stubs },
    });
    expect(wrapper.find("[data-test='logo']").exists()).toBe(false);
  });

  it("toggles modal with openModal", async () => {
    const wrapper = mount(AppHeader, {
      global: { stubs },
    });
    await wrapper.vm.openModal();
    expect(wrapper.vm.isOpen).toBe(true);
    await wrapper.vm.openModal();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("closes modal on route change", async () => {
    const wrapper = mount(AppHeader, {
      global: { stubs },
    });
    wrapper.vm.isOpen = true;
    route.value = { path: "/new" };
    await nextTick();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("updates window width", () => {
    const wrapper = mount(AppHeader, {
      global: { stubs },
    });
    window.innerWidth = 900;
    wrapper.vm.getWindowSize();
    expect(wrapper.vm.windowWidth).toBe(900);
  });

  it("handles scroll position", () => {
    const wrapper = mount(AppHeader, {
      global: { stubs },
    });
    Object.defineProperty(window, "pageYOffset", { value: 100, writable: true });
    wrapper.vm.handleScroll();
    expect(wrapper.vm.view.atTopOfPage).toBe(true);
    Object.defineProperty(window, "pageYOffset", { value: 600 });
    wrapper.vm.handleScroll();
    expect(wrapper.vm.view.atTopOfPage).toBe(false);
  });

  it("registers window listeners on mount", () => {
    mount(AppHeader, { global: { stubs } });
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
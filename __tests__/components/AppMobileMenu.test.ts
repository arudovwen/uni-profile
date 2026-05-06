import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import AppMobileMenu from "@/components/AppMobileMenu.vue";

const DialogStub = {
  template: '<div class="dialog-stub"><slot /></div>',
  emits: ["close"],
};

describe("AppMobileMenu", () => {
  const createConfig = (openRef) => ({
    stubs: {
      TransitionRoot: { template: "<div><slot /></div>" },
      TransitionChild: { template: "<div><slot /></div>" },
      Dialog: DialogStub,
      DialogPanel: { template: "<div><slot /></div>" },
      AppIcon: { template: "<span></span>" },
    },
    provide: {
      open: openRef,
    },
  });

  it("renders correctly with props when open", () => {
    const open = ref(true);
    const wrapper = mount(AppMobileMenu, {
      global: createConfig(open),
      props: { title: "Mobile Menu" },
    });

    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.props("title")).toBe("Mobile Menu");
  });

  it("closes the menu when the close button is clicked", async () => {
    const open = ref(true);
    const wrapper = mount(AppMobileMenu, {
      global: createConfig(open),
    });

    const closeButton = wrapper.find("button");
    await closeButton.trigger("click");

    expect(open.value).toBe(false);
  });

  it("closes the menu when the dialog emits close", async () => {
    const open = ref(true);
    const wrapper = mount(AppMobileMenu, {
      global: createConfig(open),
    });

    const dialog = wrapper.findComponent(DialogStub);
    await dialog.vm.$emit("close");

    expect(open.value).toBe(false);
  });

  it("handles state changes for transition visibility", async () => {
    const open = ref(false);
    const wrapper = mount(AppMobileMenu, {
      global: createConfig(open),
    });

    expect(wrapper.find("img").exists()).toBe(false);
    
    open.value = true;
    await nextTick();
    
    const openWrapper = mount(AppMobileMenu, {
      global: createConfig(open),
    });
    expect(openWrapper.find("img").exists()).toBe(true);
  });
});
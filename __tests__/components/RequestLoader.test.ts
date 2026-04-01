import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import RequestLoader from "@/components/RequestLoader.vue";

describe("RequestLoader.vue", () => {
  const globalConfig = {
    stubs: {
      TransitionRoot: {
        template: '<div v-if="show" class="transition-root-stub"><slot /></div>',
        props: ["show"]
      },
      TransitionChild: {
        template: '<div class="transition-child-stub"><slot /></div>'
      },
      Dialog: {
        name: "Dialog",
        template: '<div class="dialog-stub"><slot /></div>',
        props: ["open"],
        emits: ["close"]
      },
      DialogOverlay: {
        name: "DialogOverlay",
        template: '<div class="overlay-stub"></div>'
      }
    }
  };

  it("renders loader and text when open is true", () => {
    const wrapper = mount(RequestLoader, {
      props: { open: true, loaderText: "Processing" },
      global: globalConfig
    });

    expect(wrapper.find(".dialog-stub").exists()).toBe(true);
    expect(wrapper.text()).toContain("Processing");
    expect(wrapper.find(".loader").exists()).toBe(true);
  });

  it("does not render when open is false", () => {
    const wrapper = mount(RequestLoader, {
      props: { open: false },
      global: globalConfig
    });

    expect(wrapper.find(".transition-root-stub").exists()).toBe(false);
  });

  it("emits close when handleclose is called", async () => {
    const wrapper = mount(RequestLoader, {
      props: { open: true },
      global: globalConfig
    });

    const dialog = wrapper.findComponent({ name: "Dialog" });
    await dialog.vm.$emit("close");
    
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits actionItem when actionItem is called", () => {
    const wrapper = mount(RequestLoader, {
      props: { open: true },
      global: globalConfig
    });

    wrapper.vm.actionItem();
    expect(wrapper.emitted("actionItem")).toBeTruthy();
  });

  it("uses default loaderText when none is provided", () => {
    const wrapper = mount(RequestLoader, {
      props: { open: true },
      global: globalConfig
    });

    expect(wrapper.text()).toContain("Loading");
  });
});
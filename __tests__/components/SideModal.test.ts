import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import SideModal from "@/components/SideModal.vue";

describe("SideModal.vue", () => {
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
        emits: ["close"]
      },
      DialogOverlay: {
        template: '<div class="overlay-stub"></div>'
      },
      AppIcon: true
    }
  };

  it("renders slot content when isSideOpen is true", () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: true },
      slots: { default: '<div id="test-content">Content</div>' },
      global: globalConfig
    });

    expect(wrapper.find("#test-content").exists()).toBe(true);
    expect(wrapper.find(".dialog-stub").exists()).toBe(true);
  });

  it("does not render when isSideOpen is false", () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: false },
      global: globalConfig
    });

    expect(wrapper.find(".transition-root-stub").exists()).toBe(false);
  });

  it("emits togglePopup when Dialog triggers close", async () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: true },
      global: globalConfig
    });

    const dialog = wrapper.findComponent({ name: "Dialog" });
    await dialog.vm.$emit("close");

    expect(wrapper.emitted("togglePopup")).toBeTruthy();
  });

  it("renders close icon and emits togglePopup on click when canClose is true", async () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: true, canClose: true },
      global: globalConfig
    });

    const closeBtn = wrapper.find(".cursor-pointer");
    expect(closeBtn.exists()).toBe(true);
    
    await closeBtn.trigger("click");
    expect(wrapper.emitted("togglePopup")).toBeTruthy();
  });

  it("does not render close icon when canClose is false", () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: true, canClose: false },
      global: globalConfig
    });

    expect(wrapper.find(".cursor-pointer").exists()).toBe(false);
  });

  it("uses default props correctly", () => {
    const wrapper = mount(SideModal, {
      props: { isSideOpen: true },
      global: globalConfig
    });
    
    expect(wrapper.find(".cursor-pointer").exists()).toBe(true);
  });
});
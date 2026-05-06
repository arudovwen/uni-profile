import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import CenterProp from "@/components/Modal/CenterProp.vue";

describe("CenterProp.vue", () => {
  const TransitionRootStub = {
    props: ["show", "as"],
    template: '<div v-if="show" class="transition-root-stub"><slot /></div>',
  };

  const globalConfig = {
    stubs: {
      TransitionRoot: TransitionRootStub,
      TransitionChild: {
        props: ["as"],
        template: '<div class="transition-child-stub"><slot /></div>',
      },
      Dialog: {
        props: ["as"],
        template: '<div class="dialog-stub"><slot /></div>',
      },
      DialogOverlay: {
        template: '<div class="overlay-stub" />',
      },
      AppIcon: {
        props: ["icon"],
        template: '<i class="icon-stub" />',
      },
    },
  };

  it("emits close event when close button is clicked", async () => {
    const wrapper = mount(CenterProp, {
      global: globalConfig,
      props: {
        isModalOpen: true,
        canClose: true,
      },
    });

    const closeBtn = wrapper.find(".cursor-pointer");
    await closeBtn.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("hides close button when canClose is false", async () => {
    const wrapper = mount(CenterProp, {
      global: globalConfig,
      props: {
        isModalOpen: true,
        canClose: false,
      },
    });

    expect(wrapper.find(".cursor-pointer").exists()).toBe(false);
  });

  it("does not render content when isModalOpen is false", async () => {
    const wrapper = mount(CenterProp, {
      global: globalConfig,
      props: {
        isModalOpen: false,
      },
    });

    expect(wrapper.find(".transition-root-stub").exists()).toBe(false);
  });

  it("renders the structural trick span for centering", async () => {
    const wrapper = mount(CenterProp, {
      global: globalConfig,
      props: {
        isModalOpen: true,
      },
    });

    const span = wrapper.find("span[aria-hidden='true']");
    expect(span.exists()).toBe(true);
    expect(span.classes()).toContain("sm:inline-block");
    expect(span.text()).toBe("\u200B");
  });
});
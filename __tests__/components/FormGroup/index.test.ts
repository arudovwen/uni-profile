import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FormGroup from "@/components/FormGroup/index.vue";

describe("index.vue", () => {
  const globalConfig = {
    stubs: {
      RedDot: { template: '<span class="red-dot-stub" />' },
      AppIcon: { props: ["icon", "iconClass"], template: '<i class="icon-stub" />' },
    },
  };

  it("applies container classes based on state props", async () => {
    const wrapper = mount(FormGroup, {
      global: globalConfig,
      props: {
        error: "Required field",
        horizontal: true,
        validate: "Looks good!",
        formClass: "extra-margin",
      },
    });

    const container = wrapper.find(".formGroup");
    expect(container.classes()).toContain("has-error");
    expect(container.classes()).toContain("flex");
    expect(container.classes()).toContain("is-valid");
    expect(container.classes()).toContain("extra-margin");
  });

  it("toggles error and validation message styling", async () => {
    const wrapper = mount(FormGroup, {
      global: globalConfig,
      props: {
        error: "Error message",
        validate: "Success message",
        msgTooltip: true,
      },
    });

    const messages = wrapper.findAll("span.mt-2");
    expect(messages[0].classes()).toContain("bg-danger-500");
    expect(messages[1].classes()).toContain("bg-success-500");

    await wrapper.setProps({ msgTooltip: false });
    expect(messages[0].classes()).toContain("text-danger-500");
    expect(messages[1].classes()).toContain("text-success-500");
  });

  it("renders description and slots correctly", () => {
    const wrapper = mount(FormGroup, {
      global: globalConfig,
      props: {
        description: "Must be 8 characters",
      },
      slots: {
        default: '<input id="test-input" />',
      },
    });

    expect(wrapper.find("#test-input").exists()).toBe(true);
    expect(wrapper.find(".text-secondary-500").text()).toBe("Must be 8 characters");
  });

  it("does not render optional elements when props are false", () => {
    const wrapper = mount(FormGroup, {
      global: globalConfig,
      props: {
        label: "Minimal",
        isRequired: false,
        isOptional: false,
        info: false,
      },
    });

    expect(wrapper.find(".red-dot-stub").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("(Optional)");
    expect(wrapper.find(".icon-stub").exists()).toBe(false);
    expect(wrapper.find("label").exists()).toBe(true);
  });

  it("does not render label at all if prop is missing", () => {
    const wrapper = mount(FormGroup, {
      global: globalConfig,
      props: { label: "" },
    });
    expect(wrapper.find("label").exists()).toBe(false);
  });
});
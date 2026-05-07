import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultiCheckbox from "@/components/Checkbox/multi.vue";

vi.mock("~/assets/images/icon/ck-white.svg", () => ({
  default: "mock-path",
}));

describe("multi.vue", () => {
  it("updates styles based on value inclusion", async () => {
    const wrapper = mount(MultiCheckbox, {
      props: {
        modelValue: ["active-item"],
        value: "active-item",
        activeClass: "custom-active",
      },
    });

    const indicator = wrapper.find(".relative");
    expect(indicator.classes()).toContain("custom-active");
    expect(wrapper.find("img").exists()).toBe(true);

    await wrapper.setProps({ modelValue: [] });
    expect(indicator.classes()).not.toContain("custom-active");
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("emits update when selection changes", async () => {
    const wrapper = mount(MultiCheckbox, {
      props: {
        modelValue: [],
        value: "test-val",
      },
    });

    const input = wrapper.find("input");
    await input.setValue(["test-val"]);
    
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([["test-val"]]);
  });

  it("toggles internal state on change event", async () => {
    const wrapper = mount(MultiCheckbox, {
      props: {
        modelValue: [],
        value: "test",
        checked: false,
      },
    });

    const input = wrapper.find("input");
    
    await input.trigger("change");
    expect(wrapper.vm.ck).toBe(true);

    await input.trigger("change");
    expect(wrapper.vm.ck).toBe(false);
  });

  it("handles accessibility and disabled states", async () => {
    const wrapper = mount(MultiCheckbox, {
      props: {
        label: "Check Me",
        labelClass: "text-bold",
        disabled: true,
        modelValue: [],
      },
    });

    const label = wrapper.find("label");
    expect(label.classes()).toContain("cursor-not-allowed");
    expect(wrapper.find(".text-sm").text()).toBe("Check Me");

    await wrapper.setProps({ disabled: false });
    expect(label.classes()).toContain("cursor-pointer");
  });

  it("binds attributes and renders default state", () => {
    const wrapper = mount(MultiCheckbox, {
      props: {
        modelValue: [],
        value: "val",
        name: "test-name",
      },
      attrs: {
        id: "unique-id",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("name")).toBe("test-name");
    expect(input.attributes("id")).toBe("unique-id");
    expect(wrapper.find(".relative").classes()).toContain("bg-white");
    
    const wrapperNoLabel = mount(MultiCheckbox, {
      props: { modelValue: [], value: "val", label: "" }
    });
    expect(wrapperNoLabel.find("span.text-sm").exists()).toBe(false);
  });
});
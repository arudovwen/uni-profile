import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Index from "@/components/InputGroup/index.vue";

describe("InputGroup index.vue", () => {
  const AppIcon = { template: "<div class='app-icon'></div>", props: ["icon"] };
  const globalOptions = { components: { AppIcon } };

  it("renders with default props", () => {
    const wrapper = mount(Index, { global: globalOptions });
    const container = wrapper.find("div");
    expect(container.classes()).not.toContain("flex");
    expect(container.classes()).not.toContain("merged");
    expect(container.classes()).toContain("w-full");
    expect(wrapper.find("label").exists()).toBe(false);
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Cleave" }).exists()).toBe(false);
  });

  it("handles layout modifications", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { horizontal: true, merged: true, label: "Username" }
    });
    const container = wrapper.find("div");
    expect(container.classes()).toContain("flex");
    expect(container.classes()).toContain("merged");
    const label = wrapper.find("label");
    expect(label.classes()).toContain("flex-0");
  });

  it("handles slots", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      slots: { prepend: "<div class='pre-s'></div>", append: "<div class='app-s'></div>" }
    });
    const group = wrapper.find(".inputGroup");
    expect(group.classes()).toContain("has-prepend-slot");
    expect(group.classes()).toContain("has-append-slot");
    expect(wrapper.find(".prepend-slot").exists()).toBe(true);
    expect(wrapper.find(".append-slot").exists()).toBe(true);
  });

  it("emits native input changes", async () => {
    const wrapper = mount(Index, { global: globalOptions });
    const input = wrapper.find("input");
    await input.setValue("test value");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["test value"]);
  });

  it("renders errors with standard styling", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { error: "Required field" }
    });
    const group = wrapper.find(".inputGroup");
    expect(group.classes()).toContain("is-invalid");
    const spans = wrapper.findAll("span");
    const errorSpan = spans.find(el => el.text().includes("Required field"));
    expect(errorSpan.classes()).toContain("text-danger-500");
  });

  it("renders errors with tooltip styling", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { error: "Required field", msgTooltip: true }
    });
    const spans = wrapper.findAll("span");
    const errorSpan = spans.find(el => el.text().includes("Required field"));
    expect(errorSpan.classes()).toContain("bg-danger-500");
  });

  it("renders validation feedback with standard styling", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { validate: "Looks good" }
    });
    const group = wrapper.find(".inputGroup");
    expect(group.classes()).toContain("is-valid");
    const spans = wrapper.findAll("span");
    const validSpan = spans.find(el => el.text().includes("Looks good"));
    expect(validSpan.classes()).toContain("text-success-500");
  });

  it("renders validation feedback with tooltip styling", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { validate: "Looks good", msgTooltip: true }
    });
    const spans = wrapper.findAll("span");
    const validSpan = spans.find(el => el.text().includes("Looks good"));
    expect(validSpan.classes()).toContain("bg-success-500");
  });

  it("displays description text", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { description: "Extra hint text" }
    });
    const span = wrapper.find(".text-slate-400");
    expect(span.text()).toBe("Extra hint text");
  });

  it("toggles field data type via instance method", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { type: "text" }
    });
    expect(wrapper.vm.types).toBe("text");
    wrapper.vm.toggleType();
    expect(wrapper.vm.types).toBe("password");
    wrapper.vm.toggleType();
    expect(wrapper.vm.types).toBe("text");
  });

  it("initializes types with alternative configuration", () => {
    const wrapper = mount(Index, {
      global: globalOptions,
      props: { type: "password" }
    });
    expect(wrapper.vm.types).toBe("password");
    wrapper.vm.toggleType();
    expect(wrapper.vm.types).toBe("text");
  });
});
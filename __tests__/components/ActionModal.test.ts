import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ActionModal from "@/components/ActionModal.vue";

describe("Action Modal Component", () => {
  const globalConfig = {
    stubs: {
      TransitionRoot: { template: "<div><slot /></div>" },
      TransitionChild: { template: "<div><slot /></div>" },
      Dialog: { template: "<div><slot /></div>" },
      DialogOverlay: { template: "<div />" },
      SvgsSuccessSvg: { template: '<div class="success-svg"></div>' },
      SvgsRejectSvg: { template: '<div class="reject-svg"></div>' },
    },
  };

  it("renders with basic props and handles close", async () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        title: "Test Title",
        text: "Test Description",
        canClose: true,
      },
    });

    expect(wrapper.text()).toContain("Test Title");
    expect(wrapper.text()).toContain("Test Description");

    const closeBtn = wrapper.find(".uil-times");
    await closeBtn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");

    await wrapper.vm.handleclose();
    expect(wrapper.emitted("close")).toHaveLength(2);
  });

  it("renders image when imgUrl is provided", () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: { open: true, imgUrl: "test-img.png" },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("test-img.png");
    expect(wrapper.findComponent({ name: 'SvgsSuccessSvg' }).exists()).toBe(false);
  });

  it("handles actionItem emit and conditional classes", async () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        btnText: "Confirm",
        isOkay: false,
        type: "approve",
      },
    });

    const actionBtn = wrapper.find("button.bg-primary-500");
    await actionBtn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("actionItem");
  });

  it("handles actionItem when isOkay is true", async () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        isOkay: true,
        btnText: "Okay",
      },
    });

    const okayBtn = wrapper.find("button.bg-primary-500");
    await okayBtn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("actionItem");
  });

  it("applies reject button styles", () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        type: "reject",
        isOkay: false,
        btnText: "Delete",
      },
    });
    const btn = wrapper.find("button.bg-\\[\\#D92D20\\]");
    expect(btn.exists()).toBe(true);
  });

  it("handles anotherAction emit", async () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        isAnother: true,
        anotherText: "Do more",
      },
    });

    const anotherBtn = wrapper.findAll("button").find(b => b.text().includes("Do more"));
    await anotherBtn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("anotherAction");
  });

  it("handles cancel button visibility and click", async () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        isCancel: true,
      },
    });

    const cancelBtn = wrapper.findAll("button").find(b => b.text().includes("Cancel"));
    await cancelBtn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });

  it("shows loading spinners and disables buttons", () => {
    const wrapper = mount(ActionModal, {
      global: globalConfig,
      props: {
        open: true,
        loading: true,
        isAnother: true,
        isOkay: true,
      },
    });

    expect(wrapper.findAll("svg.animate-spin").length).toBeGreaterThan(0);
    const buttons = wrapper.findAll("button");
    buttons.forEach(btn => {
      if (btn.text() !== "Cancel" && btn.text() !== "Add another") {
        expect(btn.element.disabled).toBe(true);
      }
    });
  });

  it("verifies static bankOptions array", () => {
    const wrapper = mount(ActionModal, { global: globalConfig });
    expect(wrapper.vm.bankOptions).toHaveLength(4);
    expect(wrapper.vm.bankOptions[0].key).toBe("bankName");
  });
});
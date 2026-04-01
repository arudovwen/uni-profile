import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DirectorView from "@/components/DirectorView.vue";

vi.mock("moment", () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => "Jan 1, 1990"),
  })),
}));

describe("DirectorView", () => {
  const detail = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "08012345678",
    bvn: "12345678901",
    dob: "1990-01-01",
    linkedIn: "https://linkedin.com/in/johndoe",
    address: "123 Main St",
    signatureUrl: "sig.jpg",
    identityUrl: "id.jpg",
    iutilityBillUrl: "bill.jpg",
  };

  const globalConfig = {
    stubs: {
      MediaViewer: {
        name: "MediaViewer",
        template: '<div class="media-viewer-stub"></div>',
        props: ["media", "open"]
      },
      AppIcon: true,
    },
  };

  it("does not render if detail is null", () => {
    const wrapper = mount(DirectorView, {
      props: { detail: null },
      global: globalConfig,
    });
    expect(wrapper.find(".w-full").exists()).toBe(false);
  });

  it("renders all detail fields correctly", () => {
    const wrapper = mount(DirectorView, {
      props: { detail },
      global: globalConfig,
    });

    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john@example.com");
    expect(wrapper.text()).toContain("08012345678");
    expect(wrapper.text()).toContain("12345678901");
    expect(wrapper.text()).toContain("Jan 1, 1990");
    expect(wrapper.text()).toContain("123 Main St");
    expect(wrapper.find("a").attributes("href")).toBe(detail.linkedIn);
  });

  it("renders placeholders when optional fields are missing", () => {
    const sparseDetail = { ...detail, linkedIn: null, address: null };
    const wrapper = mount(DirectorView, {
      props: { detail: sparseDetail },
      global: globalConfig,
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("-");
  });

  it("opens MediaViewer with signature URL", async () => {
    const wrapper = mount(DirectorView, {
      props: { detail },
      global: globalConfig,
    });

    await wrapper.findAll("button")[0].trigger("click");
    await nextTick();
    
    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    expect(viewer.exists()).toBe(true);
    expect(viewer.props("media")).toBe(detail.signatureUrl);
  });

  it("opens MediaViewer with identity URL", async () => {
    const wrapper = mount(DirectorView, {
      props: { detail },
      global: globalConfig,
    });

    await wrapper.findAll("button")[1].trigger("click");
    await nextTick();

    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    expect(viewer.exists()).toBe(true);
    expect(viewer.props("media")).toBe(detail.identityUrl);
  });

  it("opens MediaViewer with utility bill URL", async () => {
    const wrapper = mount(DirectorView, {
      props: { detail },
      global: globalConfig,
    });

    await wrapper.findAll("button")[2].trigger("click");
    await nextTick();

    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    expect(viewer.exists()).toBe(true);
    expect(viewer.props("media")).toBe(detail.iutilityBillUrl);
  });

  it("closes MediaViewer when close event is emitted", async () => {
    const wrapper = mount(DirectorView, {
      props: { detail },
      global: globalConfig,
    });

    await wrapper.findAll("button")[0].trigger("click");
    await nextTick();
    
    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    await viewer.vm.$emit("close");
    await nextTick();

    expect(wrapper.findComponent({ name: "MediaViewer" }).exists()).toBe(false);
  });
});
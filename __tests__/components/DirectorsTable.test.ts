import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import DirectorTable from "@/components/DirectorsTable.vue";

vi.mock("moment", () => ({
  default: vi.fn((date) => ({
    format: vi.fn(() => "Jan 1, 1990"),
  })),
}));

describe("DirectorTable", () => {
  const directors = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "08012345678",
      dob: "1990-01-01",
      bvn: "12345678901",
      identityUrl: "https://example.com/id.jpg",
      signatureUrl: "https://example.com/sig.png",
      linkedIn: "https://linkedin.com/in/johndoe",
    },
  ];

  it("does not render table if directors array is empty", () => {
    const wrapper = mount(DirectorTable, {
      props: { directors: [] },
      global: {
        stubs: { MediaViewer: true },
      },
    });
    expect(wrapper.find("table").exists()).toBe(false);
  });

  it("renders table rows correctly when directors are provided", () => {
    const wrapper = mount(DirectorTable, {
      props: { directors },
      global: {
        stubs: { MediaViewer: true },
      },
    });

    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john@example.com");
    expect(wrapper.text()).toContain("08012345678");
    expect(wrapper.text()).toContain("Jan 1, 1990");
    expect(wrapper.text()).toContain("12345678901");
    
    const linkedinLink = wrapper.find('a[target="_blank"]');
    expect(linkedinLink.attributes("href")).toBe(directors[0].linkedIn);
  });

  it("opens media viewer when identity view is clicked", async () => {
    const wrapper = mount(DirectorTable, {
      props: { directors },
      global: {
        stubs: { MediaViewer: true },
      },
    });

    const viewButtons = wrapper.findAll("span.text-primary");
    await viewButtons[0].trigger("click");

    expect(wrapper.findComponent({ name: "MediaViewer" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MediaViewer" }).props("media")).toBe(directors[0].identityUrl);
  });

  it("opens media viewer when signature view is clicked", async () => {
    const wrapper = mount(DirectorTable, {
      props: { directors },
      global: {
        stubs: { MediaViewer: true },
      },
    });

    const viewButtons = wrapper.findAll("span.text-primary");
    await viewButtons[1].trigger("click");

    expect(wrapper.findComponent({ name: "MediaViewer" }).props("media")).toBe(directors[0].signatureUrl);
  });

  it("closes media viewer when close event is emitted", async () => {
    const wrapper = mount(DirectorTable, {
      props: { directors },
      global: {
        stubs: { MediaViewer: true },
      },
    });

    await wrapper.findAll("span.text-primary")[0].trigger("click");
    expect(wrapper.findComponent({ name: "MediaViewer" }).exists()).toBe(true);

    await wrapper.findComponent({ name: "MediaViewer" }).vm.$emit("close");
    expect(wrapper.findComponent({ name: "MediaViewer" }).exists()).toBe(false);
  });
});
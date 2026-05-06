import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InfoType from "@/components/NotificationTypes/InfoType.vue";

describe("InfoType.vue", () => {
  const mockHandleNotification = vi.fn();

  const createWrapper = (props) => {
    return mount(InfoType, {
      props,
      global: {
        provide: {
          handleNotification: mockHandleNotification,
        },
        stubs: {
          NuxtLink: {
            props: ["to"],
            template: '<a class="nuxt-link-stub" :href="to"><slot /></a>',
          },
        },
      },
    });
  };

  it("renders correctly for type 3 (shop) and unviewed state", () => {
    const wrapper = createWrapper({
      id: "1",
      type: 3,
      isViewed: false,
      text: "Shop message",
      time: "10:00 AM",
    });

    expect(wrapper.find(".uil-shop").exists()).toBe(true);
    expect(wrapper.find("p.font-medium.text-\\[\\#182230\\]").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").classes()).toContain("group-hover:text-primary");
  });

  it("renders correctly for type 1 (box) and viewed state", () => {
    const wrapper = createWrapper({
      id: "2",
      type: 1,
      isViewed: true,
      text: "Box message",
      time: "11:00 AM",
    });

    expect(wrapper.find(".uil-box").exists()).toBe(true);
    expect(wrapper.find("p.font-normal.text-\\[\\#666\\]").exists()).toBe(true);
    const circle = wrapper.find(".uil-circle");
    expect(circle.classes()).not.toContain("group-hover:text-primary");
  });

  it("renders correctly for type 0 (bag)", () => {
    const wrapper = createWrapper({ id: "3", type: 0 });
    expect(wrapper.find(".uil-bag").exists()).toBe(true);
  });

  it("renders correctly for type 2 (file)", () => {
    const wrapper = createWrapper({ id: "4", type: 2 });
    expect(wrapper.find(".uil-file").exists()).toBe(true);
  });

  it("renders correctly for type 4 (megaphone) with details link", () => {
    const wrapper = createWrapper({
      id: "5",
      type: 4,
      url: "/details/5",
      text: "Megaphone alert",
    });

    expect(wrapper.find(".uil-megaphone").exists()).toBe(true);
    const link = wrapper.find(".nuxt-link-stub");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/details/5");
    expect(link.text()).toBe("See details");
  });

  it("calls handleNotification when clicked", async () => {
    const wrapper = createWrapper({ id: "99" });
    await wrapper.find(".bg-\\[\\#F1F3F5\\]").trigger("click");
    expect(mockHandleNotification).toHaveBeenCalledWith({ id: "99" });
  });
});
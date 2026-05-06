import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PendingType from "@/components/NotificationTypes/PendingType.vue";

describe("PendingType.vue", () => {
  const mockHandleNotification = vi.fn();
  const mockUserId = "user_456";

  const createWrapper = (props) => {
    return mount(PendingType, {
      props,
      global: {
        provide: {
          handleNotification: mockHandleNotification,
          userId: mockUserId,
        },
        stubs: {
          NuxtLink: {
            props: ["to"],
            template: '<div class="nuxt-link-stub" :data-to="to"><slot /></div>',
          },
        },
      },
    });
  };

  it("renders correctly with unviewed styles and indicator", () => {
    const wrapper = createWrapper({
      id: "p1",
      isViewed: false,
      url: "/pending/1",
      text: "Pending Approval",
      time: "5m ago",
    });

    expect(wrapper.text()).toContain("Pending Approval");
    expect(wrapper.text()).toContain("5m ago");
    expect(wrapper.find("p.text-xs").classes()).toContain("font-medium");
    expect(wrapper.find(".uil-info-circle").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").exists()).toBe(true);
  });

  it("renders viewed state without the circle indicator", () => {
    const wrapper = createWrapper({
      id: "p2",
      isViewed: true,
      url: "/pending/2",
      text: "Review Completed",
      time: "1h ago",
    });

    expect(wrapper.find("p.text-xs").classes()).toContain("font-normal");
    expect(wrapper.find(".uil-circle").exists()).toBe(false);
  });

  it("emits the correct data to handleNotification on click", async () => {
    const wrapper = createWrapper({
      id: "p3",
      isViewed: false,
      url: "/test",
      text: "Click Action",
      time: "Now",
    });

    await wrapper.find(".bg-white").trigger("click");

    expect(mockHandleNotification).toHaveBeenCalledWith({
      userId: mockUserId,
      id: "p3",
    });
  });

  it("links correctly to the provided url via NuxtLink", () => {
    const path = "/custom-path";
    const wrapper = createWrapper({
      id: "p4",
      isViewed: true,
      url: path,
      text: "Path Test",
      time: "Today",
    });

    const link = wrapper.find(".nuxt-link-stub");
    expect(link.attributes("data-to")).toBe(path);
    expect(wrapper.find("button").text()).toBe("See more");
  });
});
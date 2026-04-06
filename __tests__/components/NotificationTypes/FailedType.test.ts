import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FailedType from "@/components/NotificationTypes/FailedType.vue";

describe("FailedType.vue", () => {
  const mockHandleNotification = vi.fn();
  const mockUserId = "user_12345";

  const createWrapper = (props) => {
    return mount(FailedType, {
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

  it("renders notification details and applies correct font weight for unviewed", () => {
    const wrapper = createWrapper({
      id: "fail_1",
      isViewed: false,
      url: "/orders/1",
      text: "Payment Failed",
      time: "2 mins ago",
    });

    expect(wrapper.text()).toContain("Payment Failed");
    expect(wrapper.text()).toContain("2 mins ago");
    const textField = wrapper.find("p.text-xs");
    expect(textField.classes()).toContain("font-medium");
    expect(wrapper.find(".uil-info-circle").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").exists()).toBe(true);
  });

  it("renders normal font weight and hides circle icon when viewed", () => {
    const wrapper = createWrapper({
      id: "fail_2",
      isViewed: true,
      url: "/orders/2",
      text: "System Error",
      time: "1 hour ago",
    });

    const textField = wrapper.find("p.text-xs");
    expect(textField.classes()).toContain("font-normal");
    expect(wrapper.find(".uil-circle").exists()).toBe(false);
  });

  it("triggers markNotification with userId and id on click", async () => {
    const wrapper = createWrapper({
      id: "fail_3",
      isViewed: false,
      url: "/orders/3",
      text: "Retry Logic",
      time: "Just now",
    });

    await wrapper.find(".bg-white").trigger("click");

    expect(mockHandleNotification).toHaveBeenCalledWith({
      userId: mockUserId,
      id: "fail_3",
    });
  });

  it("renders the NuxtLink with the correct destination", () => {
    const targetUrl = "/target-path";
    const wrapper = createWrapper({
      id: "fail_4",
      isViewed: true,
      url: targetUrl,
      text: "Link Test",
      time: "Today",
    });

    const linkStub = wrapper.find(".nuxt-link-stub");
    expect(linkStub.exists()).toBe(true);
    expect(linkStub.attributes("data-to")).toBe(targetUrl);
    expect(wrapper.find("button").text()).toBe("See more");
  });
});
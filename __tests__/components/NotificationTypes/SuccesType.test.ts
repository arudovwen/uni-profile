import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SuccessType from "@/components/NotificationTypes/SuccessType.vue";

describe("SuccessType.vue", () => {
  const mockHandleNotification = vi.fn();
  const mockUserId = "user_success_789";

  const createWrapper = (props) => {
    return mount(SuccessType, {
      props,
      global: {
        provide: {
          handleNotification: mockHandleNotification,
          userId: mockUserId,
        },
      },
    });
  };

  it("renders notification data and unviewed state", () => {
    const wrapper = createWrapper({
      id: "s1",
      isViewed: false,
      text: "Transfer Successful",
      time: "Just now",
      url: "/success",
    });

    expect(wrapper.text()).toContain("Transfer Successful");
    expect(wrapper.text()).toContain("Just now");
    expect(wrapper.find("p.text-xs").classes()).toContain("font-medium");
    expect(wrapper.find(".uit-arrow-circle-up").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").exists()).toBe(true);
  });

  it("renders viewed state with normal font and no indicator", () => {
    const wrapper = createWrapper({
      id: "s2",
      isViewed: true,
      text: "Verified",
      time: "Yesterday",
    });

    expect(wrapper.find("p.text-xs").classes()).toContain("font-normal");
    expect(wrapper.find(".uil-circle").exists()).toBe(false);
  });

  it("calls handleNotification when the inner flex container is clicked", async () => {
    const wrapper = createWrapper({
      id: "s3",
      isViewed: false,
      text: "Click Me",
      time: "12:00",
    });

    await wrapper.find(".flex.items-start").trigger("click");

    expect(mockHandleNotification).toHaveBeenCalledWith({
      userId: mockUserId,
      id: "s3",
    });
  });
});
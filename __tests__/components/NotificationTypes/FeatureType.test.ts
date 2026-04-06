import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FeatureType from "@/components/NotificationTypes/FeatureType.vue";

describe("FeatureType.vue", () => {
  const mockHandleNotification = vi.fn();
  const mockUserId = "user_987";

  const createWrapper = (props) => {
    return mount(FeatureType, {
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

  it("renders notification content and unviewed state styles", () => {
    const wrapper = createWrapper({
      id: "feat_1",
      isViewed: false,
      url: "/features/new",
      text: "New Feature Alert",
      time: "5 mins ago",
    });

    expect(wrapper.text()).toContain("New Feature Alert");
    expect(wrapper.text()).toContain("5 mins ago");
    expect(wrapper.find("p.text-xs").classes()).toContain("font-medium");
    expect(wrapper.find(".uil-megaphone").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").exists()).toBe(true);
  });

  it("renders viewed state with normal font and no circle icon", () => {
    const wrapper = createWrapper({
      id: "feat_2",
      isViewed: true,
      url: "/features/old",
      text: "Update Info",
      time: "Yesterday",
    });

    expect(wrapper.find("p.text-xs").classes()).toContain("font-normal");
    expect(wrapper.find(".uil-circle").exists()).toBe(false);
  });

  it("executes markNotification on click with correct payload", async () => {
    const wrapper = createWrapper({
      id: "feat_3",
      isViewed: false,
      url: "/test",
      text: "Click Test",
      time: "Now",
    });

    await wrapper.find(".bg-white").trigger("click");

    expect(mockHandleNotification).toHaveBeenCalledWith({
      userId: mockUserId,
      id: "feat_3",
    });
  });

  it("configures NuxtLink and button correctly", () => {
    const path = "/promo-page";
    const wrapper = createWrapper({
      id: "feat_4",
      isViewed: true,
      url: path,
      text: "Promo",
      time: "1d",
    });

    const link = wrapper.find(".nuxt-link-stub");
    expect(link.attributes("data-to")).toBe(path);
    expect(wrapper.find("button").text()).toContain("Learn more");
    expect(wrapper.find(".uil-arrow-up").exists()).toBe(true);
  });
});
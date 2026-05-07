import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import NewFeatures from "@/components/NotificationTypes/NewFeatures.vue";

describe("NewFeatures.vue", () => {
  const globalConfig = {
    stubs: {
      Feature: {
        props: ["url", "text", "time"],
        template: '<div class="feature-stub">{{ text }}</div>'
      },
      EmptyData: {
        props: ["title"],
        template: '<div class="empty-stub">{{ title }}</div>'
      }
    }
  };

  it("renders the EmptyData component because Notifications.length is truthy", () => {
    const wrapper = mount(NewFeatures, {
      global: globalConfig
    });

    expect(wrapper.find(".empty-stub").exists()).toBe(true);
    expect(wrapper.find(".empty-stub").text()).toBe("No new feature");
    expect(wrapper.find(".grid").exists()).toBe(false);
  });

  it("would render the list only if Notifications were empty due to the ! logic", () => {
    const wrapper = mount(NewFeatures, {
      global: globalConfig
    });
    
    expect(wrapper.find("h5").exists()).toBe(false);
  });
});
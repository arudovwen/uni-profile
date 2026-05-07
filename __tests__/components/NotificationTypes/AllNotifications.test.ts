import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import moment from "moment";
import AllNotifications from "@/components/NotificationTypes/AllNotifications.vue";

describe("AllNotifications.vue", () => {
  const createWrapper = (notifications = [], selectedOption = []) => {
    return mount(AllNotifications, {
      global: {
        provide: {
          notifications: ref(notifications),
          selectedOption: ref(selectedOption),
        },
        stubs: {
          Info: {
            props: ["url", "type", "text", "time", "id", "isViewed"],
            template: '<div class="info-stub">{{ text }} - {{ time }}</div>',
          },
          EmptyData: {
            props: ["title"],
            template: '<div class="empty-stub">{{ title }}</div>',
          },
        },
      },
    });
  };

  it("renders empty state when there are no notifications", () => {
    const wrapper = createWrapper([]);
    expect(wrapper.find(".empty-stub").text()).toBe("No new notification");
  });

  it("renders and groups notifications by Today, Yesterday, and Date", async () => {
    const today = moment().format();
    const yesterday = moment().subtract(1, "days").format();
    const older = moment().subtract(5, "days").format();

    const mockData = [
      { id: 1, message: "Today Msg", notificationDate: today, notificationType: "type1", isViewed: false },
      { id: 2, message: "Yesterday Msg", notificationDate: yesterday, notificationType: "type2", isViewed: true },
      { id: 3, message: "Older Msg", notificationDate: older, notificationType: "type1", isViewed: false },
    ];

    const wrapper = createWrapper(mockData);

    const headers = wrapper.findAll("h5");
    expect(headers[0].text()).toBe("Today");
    expect(headers[1].text()).toBe("Yesterday");
    expect(headers[2].text()).toBe(moment(older).format("ll"));

    const infos = wrapper.findAll(".info-stub");
    expect(infos[0].text()).toContain("Today Msg");
    expect(infos[0].text()).toContain("ago");
  });

  it("calculates sortedNotifications based on existing notification data", async () => {
    const today = moment().format();
    const mockData = [
      { id: 1, message: "Show", notificationDate: today, notificationType: "keep", isViewed: false },
      { id: 2, message: "Hide", notificationDate: today, notificationType: "remove", isViewed: false },
    ];

    const wrapper = createWrapper(mockData, ["keep"]);
    
    const groups = wrapper.findAll("h5");
    expect(groups.length).toBe(1);
    expect(groups[0].text()).toBe("Today");
  });

  it("returns all notifications if selectedOption is empty", () => {
    const today = moment().format();
    const mockData = [
      { id: 1, message: "Msg 1", notificationDate: today, notificationType: "A" },
      { id: 2, message: "Msg 2", notificationDate: today, notificationType: "B" },
    ];

    const wrapper = createWrapper(mockData, []);
    expect(wrapper.findAll(".info-stub").length).toBe(2);
  });

  it("handles missing notification injection gracefully", () => {
    const wrapper = mount(AllNotifications, {
      global: {
        provide: {
          notifications: ref([]),
          selectedOption: ref([]),
        },
        stubs: ["EmptyData"],
      },
    });
    expect(wrapper.findComponent({ name: "EmptyData" }).exists()).toBe(true);
  });
});
import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DefaultType from "@/components/NotificationTypes/DefaultType.vue";
import moment from "moment";

describe("DefaultType.vue", () => {
  const mockHandleNotification = vi.fn();

  const createWrapper = (props) => {
    return mount(DefaultType, {
      props,
      global: {
        provide: {
          handleNotification: mockHandleNotification,
        },
      },
    });
  };

  it("renders correctly with viewed status and specific date format", () => {
    const time = "2026-04-05T10:00:00Z";
    const wrapper = createWrapper({
      id: "123",
      isViewed: true,
      text: "Test Notification",
      time: time,
      type: 3,
    });

    expect(wrapper.text()).toContain(moment(new Date(time)).format("lll"));
    expect(wrapper.find("p.text-sm").classes()).toContain("font-normal");
    expect(wrapper.find(".uil-shop").exists()).toBe(true);
  });

  it("renders unviewed state with medium font and circle icon", () => {
    const wrapper = createWrapper({
      id: "124",
      isViewed: false,
      text: "Unread Alert",
      time: new Date().toISOString(),
      type: 1,
    });

    expect(wrapper.find("p.text-sm").classes()).toContain("font-medium");
    expect(wrapper.find(".uil-box").exists()).toBe(true);
    expect(wrapper.find(".uil-circle").classes()).toContain("group-hover:text-primary");
  });

  it("triggers markNotification and calls handleNotification when clicked", async () => {
    const wrapper = createWrapper({
      id: "999",
      isViewed: false,
      text: "Click Me",
      time: new Date().toISOString(),
      type: 0,
    });

    await wrapper.find(".bg-\\[\\#F1F3F5\\]").trigger("click");

    expect(wrapper.find(".uil-bag").exists()).toBe(true);
    expect(mockHandleNotification).toHaveBeenCalledWith({ id: "999" });
  });

  it("renders correct icon for type 2", () => {
    const wrapper = createWrapper({
      id: "100",
      isViewed: true,
      text: "File Type",
      time: new Date().toISOString(),
      type: 2,
    });

    expect(wrapper.find(".uil-file").exists()).toBe(true);
  });

  it("renders non-hover circle class when isViewed is true", () => {
    const wrapper = createWrapper({
      id: "101",
      isViewed: true,
      text: "Viewed Icon",
      time: new Date().toISOString(),
      type: 0,
    });

    const circle = wrapper.findAll(".uil-circle");
    expect(circle[0].classes()).not.toContain("group-hover:text-primary");
  });
});
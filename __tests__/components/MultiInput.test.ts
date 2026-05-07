import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultiInput from "@/components/MultiInput.vue";

describe("MultiInput.vue", () => {
  const mockMarkets = [
    {
      id: 1,
      title: "Market 1",
      applications: [
        {
          id: 10,
          title: "App 10",
          subApplications: [{ id: 100, title: "Sub 100" }]
        }
      ]
    },
    {
      id: 2,
      title: "Market 2",
      applications: []
    }
  ];

  const defaultProps = {
    markets: mockMarkets,
    error: false,
    selectedmarkets: [1],
    applications: [10],
    subapplications: [100]
  };

  const globalConfig = {
    stubs: {
      AppIcon: true
    },
    directives: {
      "click-outside": vi.fn()
    }
  };

  it("renders selected market names correctly", () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    expect(wrapper.text()).toContain("Market 1");
  });

  it("toggles the dropdown visibility", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    const trigger = wrapper.find(".cursor-default");
    
    await trigger.trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);
    
    await trigger.trigger("click");
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("filters markets based on search query", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    wrapper.vm.isOpen = true;
    await wrapper.find('input[placeholder="Type name here"]').setValue("Market 2");
    
    expect(wrapper.vm.filteredMarkets).toHaveLength(1);
    expect(wrapper.vm.filteredMarkets[0].title).toBe("Market 2");
  });

  it("returns 0 for filteredMarkets if no markets provided", async () => {
    const wrapper = mount(MultiInput, {
      props: { ...defaultProps, markets: [] },
      global: globalConfig
    });
    expect(wrapper.vm.filteredMarkets).toBe(0);
  });

  it("removes values and their children when removeValue is called", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    
    wrapper.vm.removeValue(1);
    
    expect(wrapper.vm.data.selectedmarkets).not.toContain(1);
    expect(wrapper.vm.data.applications).not.toContain(10);
    expect(wrapper.emitted("getValue")).toBeTruthy();
  });

  it("handles market checkbox updates", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    
    wrapper.vm.data.selectedmarkets = [];
    wrapper.vm.handleUpdate(1, "market");
    
    expect(wrapper.vm.data.applications).toEqual([]);
    expect(wrapper.emitted("getValue")).toBeTruthy();
  });

  it("handles application checkbox updates and filters subapplications", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    
    wrapper.vm.data.applications = [];
    wrapper.vm.handleUpdate(10, "application", 1);
    
    expect(wrapper.vm.data.subapplications).toEqual([]);
  });

  it("emits getValue and closes on handleSave", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    wrapper.vm.isOpen = true;
    
    wrapper.vm.handleSave();
    
    expect(wrapper.emitted("getValue")).toBeTruthy();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("closes dropdown via toggleOpen (click-outside behavior)", () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    wrapper.vm.isOpen = true;
    wrapper.vm.toggleOpen();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("shows error border when error prop is true", () => {
    const wrapper = mount(MultiInput, {
      props: { ...defaultProps, error: true },
      global: globalConfig
    });
    expect(wrapper.find(".border-red-500").exists()).toBe(true);
  });

  it("triggers getValue when subapplication checkbox changes", async () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    wrapper.vm.isOpen = true;
    
    const subAppCheckbox = wrapper.find('input[type="checkbox"][value="100"]');
    await subAppCheckbox.setValue(false);
    
    expect(wrapper.emitted("getValue")).toBeTruthy();
  });

  it("handles cases where getMarketName finds no result", () => {
    const wrapper = mount(MultiInput, {
      props: defaultProps,
      global: globalConfig
    });
    expect(wrapper.vm.getMarketName(999)).toBeUndefined();
  });
});
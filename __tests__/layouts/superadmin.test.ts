import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, inject, nextTick } from "vue";
import Layout from "@/layouts/superadmin.vue";

const ChildComponent = defineComponent({
  setup() {
    const showSideBar = inject("showSideBar");
    const toggleSideBar = inject("toggleSideBar");
    return { showSideBar, toggleSideBar };
  },
  template: `
    <div>
      <span id="sidebar-status">{{ showSideBar }}</span>
      <button id="toggle-btn" @click="toggleSideBar(true)">Toggle</button>
    </div>
  `
});

describe("Superadmin Layout", () => {
  const globalConfig = {
    stubs: {
      LayoutSideComponent: { template: '<div class="side-comp"></div>' },
      LayoutMobileSideComponent: { template: '<div class="mobile-side-comp"></div>' },
      AppHeader: { template: '<div class="app-header"></div>' },
      MobileHeader: { template: '<div class="mobile-header"></div>' },
    }
  };

  it("provides showSideBar state and toggleSideBar function to children", async () => {
    const wrapper = mount(Layout, {
      global: globalConfig,
      slots: {
        default: ChildComponent
      }
    });

    const status = wrapper.find("#sidebar-status");
    const button = wrapper.find("#toggle-btn");

    expect(status.text()).toBe("false");

    await button.trigger("click");
    await nextTick();
    expect(status.text()).toBe("true");

    wrapper.vm.$.provides.toggleSideBar(false);
    await nextTick();
    expect(status.text()).toBe("false");
  });

  it("applies correct responsive utility classes", () => {
    const wrapper = mount(Layout, { global: globalConfig });
    
    expect(wrapper.find(".hidden.lg\\:block").exists()).toBe(true);
    expect(wrapper.find(".overflow-auto").classes()).toContain("lg:min-h-[80vh]");
    expect(wrapper.find(".flex-col.gap-y-4").exists()).toBe(true);
  });
});
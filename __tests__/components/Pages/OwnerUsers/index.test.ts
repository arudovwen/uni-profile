import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import Index from "@/components/Pages/OwnerUsers/index.vue";

describe("OwnerUsers index.vue", () => {
  const createWrapper = () => {
    return mount(Index, {
      global: {
        stubs: {
          HeaderComponent: true,
          AppTab: {
            template: '<div class="app-tab"><button v-for="t in tabs" :id="t.key" @click="$emit(\'set-active\', t.key)">{{t.title}}</button></div>',
            props: ['tabs', 'active']
          },
          UsersTable: {
            template: '<div class="users-table"></div>'
          },
          Invites: {
            template: '<div class="invites-view"></div>'
          }
        }
      }
    });
  };

  it("renders correctly with initial members tab", () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent({ name: 'HeaderComponent' }).exists()).toBe(true);
    expect(wrapper.find(".users-table").exists()).toBe(true);
    expect(wrapper.find(".invites-view").exists()).toBe(false);
  });

  it("switches to invites tab when event is emitted", async () => {
    const wrapper = createWrapper();
    const tabComponent = wrapper.find(".app-tab");
    
    await tabComponent.find("#invites").trigger("click");
    await nextTick();

    expect(wrapper.vm.active).toBe("invites");
    expect(wrapper.find(".invites-view").exists()).toBe(true);
    expect(wrapper.find(".users-table").exists()).toBe(false);
  });

  it("switches back to members tab", async () => {
    const wrapper = createWrapper();
    wrapper.vm.active = "invites";
    await nextTick();
    
    const tabComponent = wrapper.find(".app-tab");
    await tabComponent.find("#members").trigger("click");
    await nextTick();

    expect(wrapper.vm.active).toBe("members");
    expect(wrapper.find(".users-table").exists()).toBe(true);
  });

  it("contains correctly structured tabs data", () => {
    const wrapper = createWrapper();
    const tabs = wrapper.vm.tabs;
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toEqual({ title: "Users", key: "members" });
    expect(tabs[1]).toEqual({ title: "Invites", key: "invites" });
  });
});
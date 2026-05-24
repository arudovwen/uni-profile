import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { reactive, nextTick } from "vue";
import Index from "@/components/Pages/OwnerUsers/index.vue";

const mockRoute = reactive({
  path: "/users-management/members"
});

vi.stubGlobal("useRoute", () => mockRoute);
vi.stubGlobal("definePageMeta", vi.fn());

describe("OwnerUsers index.vue", () => {
  beforeEach(() => {
    mockRoute.path = "/users-management/members";
  });

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

  it("switches back to members tab", async () => {
    mockRoute.path = "/users-management/invites";
    const wrapper = createWrapper();
    await nextTick();
    
    mockRoute.path = "/users-management/members";
    await nextTick();

    expect(wrapper.vm.active).toBe("members");
    expect(wrapper.find(".users-table").exists()).toBe(true);
  });

  it("contains correctly structured tabs data", () => {
    const wrapper = createWrapper();
    const tabs = wrapper.vm.tabs;
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toEqual({ title: "Users", key: "members", to: "/users-management/members" });
    expect(tabs[1]).toEqual({ title: "Invites", key: "invites", to: "/users-management/invites" });
  });
});
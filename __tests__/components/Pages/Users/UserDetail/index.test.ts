import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Index from '@/components/Pages/Users/UserDetail/index.vue';
import { getUserDetail } from "~/services/settingservices";

const mockRoute = {
  path: "/users-management/user-detail/123/profile",
  query: { name: 'John Doe' },
  params: { id: '123' }
};

vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn()
}));

vi.stubGlobal('useRoute', () => mockRoute);

vi.mock("virtual:public?%2Fimages%2Fenable-user.svg", () => ({ default: "mock-enable-user.svg" }));
vi.mock("virtual:public?%2Fimages%2Frevoke-user.svg", () => ({ default: "mock-revoke-user.svg" }));
vi.mock("~/services/userservices", () => ({
  getSingleInvite: vi.fn(() => Promise.resolve({ status: 200, data: { data: {} } })),
  getSubApps: vi.fn(() => Promise.resolve({ status: 200, data: { data: [] } }))
}));

describe('UserDetail Index.vue', () => {
  const globalStubs = {
    GoBack: true,
    SideTab: true,
    Information: { template: '<div class="info-comp"></div>' },
    Apps: { template: '<div class="apps-comp"></div>' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.path = "/users-management/user-detail/123/profile";
    mockRoute.query.name = 'John Doe';
    mockRoute.params.id = '123';
    
    getUserDetail.mockResolvedValue({
      status: 200,
      data: { data: { subAppCodes: ['APP1', 'APP2'] } }
    });
  });

  it('handles failed user detail fetch', async () => {
    getUserDetail.mockResolvedValueOnce({ status: 400 });
    const wrapper = mount(Index, { global: { stubs: globalStubs } });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(wrapper.vm.myUserApps).toEqual([]);
  });

  it('defaults to profile active tab and renders Information component', async () => {
    mockRoute.path = "/users-management/user-detail/123/profile";

    const wrapper = mount(Index, { global: { stubs: globalStubs } });

    expect(wrapper.vm.active).toBe('profile');
    expect(wrapper.find('.info-comp').exists()).toBe(true);
    expect(wrapper.find('.apps-comp').exists()).toBe(false);
  });

  it('does not render name heading if name query is missing', async () => {
    mockRoute.query.name = undefined;
    
    const wrapper = mount(Index, { global: { stubs: globalStubs } });
    
    expect(wrapper.find('h2').exists()).toBe(false);
  });

  it('provides myUserApps to children', async () => {
    const TestChild = {
      inject: ['myUserApps'],
      template: '<div class="child">{{ myUserApps.length }}</div>'
    };

    const wrapper = mount(Index, {
      global: {
        stubs: {
          ...globalStubs,
          Information: TestChild
        }
      }
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await nextTick();
    
    expect(wrapper.find('.child').text()).toBe('2');
  });
});
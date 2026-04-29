import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Index from '@/components/Pages/Users/UserDetail/index.vue';
import { getUserDetail } from "~/services/settingservices";

const { mockRoute } = vi.hoisted(() => ({
  mockRoute: {
    query: { name: 'John Doe' },
    params: { id: '123' }
  }
}));

vi.mock("~/services/settingservices", () => ({
  getUserDetail: vi.fn()
}));

vi.stubGlobal('useRoute', () => mockRoute);

describe('UserDetail Index.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    getUserDetail.mockResolvedValue({
      status: 200,
      data: { data: { subAppCodes: ['APP1', 'APP2'] } }
    });
  });

  it('handles failed user detail fetch', async () => {
    getUserDetail.mockResolvedValueOnce({ status: 400 });
    wrapper = mount(Index, {
      global: { stubs: { GoBack: true, SideTab: true, Information: true, Apps: true } }
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(wrapper.vm.myUserApps).toEqual([]);
  });

  it('toggles active tabs and switches components', async () => {
    wrapper = mount(Index, {
      global: {
        stubs: {
          GoBack: true,
          SideTab: {
            props: ['active'],
            template: '<div class="tab-trigger" @click="$emit(\'setActive\', \'apps\')"></div>'
          },
          Information: { template: '<div class="info-comp"></div>' },
          Apps: { template: '<div class="apps-comp"></div>' }
        }
      }
    });

    expect(wrapper.find('.info-comp').exists()).toBe(true);
    
    await wrapper.find('.tab-trigger').trigger('click');
    await nextTick();

    expect(wrapper.vm.active).toBe('apps');
    expect(wrapper.find('.apps-comp').exists()).toBe(true);
    expect(wrapper.find('.info-comp').exists()).toBe(false);
  });

  it('does not render name heading if name query is missing', async () => {
    mockRoute.query.name = undefined;
    
    wrapper = mount(Index, {
      global: { stubs: { GoBack: true, SideTab: true, Information: true, Apps: true } }
    });
    
    expect(wrapper.find('h2').exists()).toBe(false);
    mockRoute.query.name = 'John Doe';
  });

  it('provides myUserApps to children', async () => {
    const TestChild = {
      inject: ['myUserApps'],
      template: '<div class="child">{{ myUserApps.length }}</div>'
    };

    wrapper = mount(Index, {
      global: {
        stubs: {
          GoBack: true,
          SideTab: true,
          Information: TestChild,
          Apps: true
        }
      }
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await nextTick();
    
    expect(wrapper.find('.child').text()).toBe('2');
  });
});
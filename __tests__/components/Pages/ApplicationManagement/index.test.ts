import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Index from '@/components/Pages/ApplicationManagement/index.vue';
import * as userServices from '~/services/userservices';
import { toast } from 'vue3-toastify';

vi.mock('~/services/userservices', () => ({
  getSubApps: vi.fn(),
  editSubApp: vi.fn()
}));

vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

const mockNavigateTo = vi.fn();
vi.stubGlobal('navigateTo', mockNavigateTo);

describe('ApplicationManagement Index', () => {
  const mockData = [
    { 
      id: 'app-1', 
      name: 'App One', 
      code: 'A1', 
      url: 'test.com', 
      isTwoFactorAuthEnabled: true, 
      isDisabled: false, 
      iconUrl: 'icon1.png' 
    }
  ];

  const globalConfig = {
    stubs: {
      HeaderComponent: true,
      AppButton: {
        template: '<button class="new-app-stub" @click="$emit(\'click\')">{{ text }}</button>',
        props: ['text']
      },
      CustomTable: {
        template: `
          <div>
            <div v-for="row in rows" :key="row.id">
              <slot name="table-row-name" :row="row" />
              <slot name="table-row-isTwoFactorAuthEnabled" :row="row" />
              <slot name="table-row-isDisabled" :row="row" />
              <slot name="table-row-action" :row="row" />
            </div>
          </div>`,
        props: ['rows']
      },
      Menu: { template: '<div><slot /></div>' },
      MenuButton: { template: '<button><slot /></button>' },
      MenuItems: { template: '<div><slot /></div>' },
      Float: { template: '<div><slot /></div>' },
      SwitchGroup: { template: '<div><slot /></div>' },
      Switch: {
        template: '<button class="switch-btn" @click="$emit(\'click\')"><slot /></button>',
        props: ['modelValue']
      },
      AppIcon: true,
      DeleteModal: {
        template: '<div v-if="open"><button id="confirm-del" @click="$emit(\'deleteItem\')"></button></div>',
        props: ['open']
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    userServices.getSubApps.mockResolvedValue({ status: 200, data: { data: mockData } });
  });

  it('fetches and displays data on mount', async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    expect(userServices.getSubApps).toHaveBeenCalled();
    expect(wrapper.text()).toContain('App One');
  });

  it('toggles 2FA status successfully', async () => {
    userServices.editSubApp.mockResolvedValue({ status: 200 });
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    const switchBtn = wrapper.findAll('.switch-btn')[0];
    await switchBtn.trigger('click');

    expect(userServices.editSubApp).toHaveBeenCalledWith(expect.objectContaining({
      isTwoFactorAuthEnabled: false
    }));
    await flushPromises();
    expect(toast.info).toHaveBeenCalledWith('Updated successfully');
  });

  it('toggles application disabled status successfully', async () => {
    userServices.editSubApp.mockResolvedValue({ status: 200 });
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    const switchBtn = wrapper.findAll('.switch-btn')[1];
    await switchBtn.trigger('click');

    expect(userServices.editSubApp).toHaveBeenCalledWith(expect.objectContaining({
      isDisabled: true
    }));
    await flushPromises();
    expect(toast.success).toHaveBeenCalledWith('Updated successfully');
  });

  it('handles error when toggling status', async () => {
    userServices.editSubApp.mockRejectedValue({
      response: { data: { message: 'Error updating' } }
    });
    
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();

    const switchBtn = wrapper.findAll('.switch-btn')[1];
    await switchBtn.trigger('click');

    await flushPromises();
    expect(toast.error).toHaveBeenCalledWith('Error updating');
  });

  it('triggers getData on search query change', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    
    wrapper.vm.queryParams.Search = 'new search';
    await nextTick();
    
    vi.advanceTimersByTime(800);
    expect(userServices.getSubApps).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('triggers getData on page or sort change', async () => {
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    
    expect(userServices.getSubApps).toHaveBeenCalledTimes(2);
  });

  it('handles failed data fetch', async () => {
    userServices.getSubApps.mockRejectedValueOnce(new Error('Fetch failed'));
    const wrapper = mount(Index, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.setLoader).toBe(false);
  });

  it('covers handleDelete execution', async () => {
    const wrapper = mount(Index, { global: globalConfig });
    wrapper.vm.handleDelete();
  });
});
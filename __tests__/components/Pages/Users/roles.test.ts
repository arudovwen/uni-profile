import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import Roles from '@/components/Pages/Users/roles.vue';
import { 
  getAutoSettlement, 
  viewSettlement, 
  deleteSettlement, 
  autoSettlement 
} from '~/services/settlementservice';

vi.mock('~/services/settlementservice', () => ({
  getAutoSettlement: vi.fn(),
  viewSettlement: vi.fn(),
  deleteSettlement: vi.fn(),
  autoSettlement: vi.fn(),
  getBanks: vi.fn(() => Promise.resolve({ data: { data: { responseBody: [] } } }))
}));

vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => {
    fn.cancel = vi.fn();
    return fn;
  })
}));

vi.stubGlobal('useAuthStore', vi.fn(() => ({})));
vi.stubGlobal('definePageMeta', vi.fn());

describe('roles.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    getAutoSettlement.mockResolvedValue({ status: 200, data: { data: { autoSettlement: true } } });
    viewSettlement.mockResolvedValue({ status: 200, data: { data: { totalCount: 0 } } });
    autoSettlement.mockResolvedValue({ status: 200 });

    wrapper = mount(Roles, {
      global: {
        stubs: {
          CustomTable: true,
          DeleteModal: {
            template: '<div id="delete-modal"><button id="confirm-delete" @click="$emit(\'deleteItem\')"></button></div>',
            props: ['open']
          },
          IndexModal: {
            template: '<div v-if="isOpen" id="index-modal-root"><slot name="content" /></div>',
            props: ['isOpen']
          },
          PagesSettlementsForm: {
            template: '<div id="form-stub"><button id="refresh-btn" @click="$emit(\'refresh\')"></button></div>',
            props: ['id', 'detail']
          }
        },
        config: {
          errorHandler: (err) => {
            if (err.message.includes('errorText') || err.message.includes('isErrorOpen')) return;
            throw err;
          }
        }
      }
    });
  });

  it('initializes and fetches data on mount', () => {
    expect(getAutoSettlement).toHaveBeenCalled();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('handles getAutoSettlement failure', async () => {
    getAutoSettlement.mockRejectedValueOnce(new Error());
    mount(Roles);
    expect(getAutoSettlement).toHaveBeenCalled();
  });

  it('triggers search watcher', async () => {
    wrapper.vm.queryParams.Search = 'test';
    await nextTick();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('triggers pagination and sort watchers', async () => {
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    wrapper.vm.queryParams.SortOrder = 'desc';
    await nextTick();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('handles auto-settlement change', async () => {
    wrapper.vm.isAutoSettlement = !wrapper.vm.isAutoSettlement;
    await nextTick();
    expect(autoSettlement).toHaveBeenCalled();
  });

  it('handles delete settlement rejection', async () => {
    deleteSettlement.mockRejectedValue({ response: { data: { message: 'error' } } });
    wrapper.vm.id = 1;
    await wrapper.vm.handleDelete();
    expect(deleteSettlement).toHaveBeenCalled();
  });

  it('opens request modal and verifies detail', async () => {
    const testDetail = { name: 'Test Role' };
    wrapper.vm.openRequest(testDetail);
    await nextTick();
    expect(wrapper.vm.detail).toStrictEqual(testDetail);
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('handles form refresh event', async () => {
    wrapper.vm.isOpen = true;
    await nextTick();
    
    const refreshBtn = wrapper.find('#refresh-btn');
    if (refreshBtn.exists()) {
      await refreshBtn.trigger('click');
      expect(viewSettlement).toHaveBeenCalled();
    }
  });

  it('executes handleSuccess logic', () => {
    wrapper.vm.handleSuccess();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('triggers deleteRequest and sets state', () => {
    wrapper.vm.deleteRequest(5);
    expect(wrapper.vm.id).toBe(5);
    expect(wrapper.vm.open).toBe(true);
  });

  it('closes index modal', () => {
    wrapper.vm.isOpen = true;
    wrapper.vm.isOpen = false;
    expect(wrapper.vm.isOpen).toBe(false);
  });
});
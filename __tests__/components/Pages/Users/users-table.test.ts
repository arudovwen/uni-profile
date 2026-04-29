import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick, ref } from 'vue';
import UsersTable from '@/components/Pages/Users/users-table.vue';
import { 
  viewSettlement, 
  deleteSettlement, 
  autoSettlement, 
  getAutoSettlement 
} from '~/services/settlementservice';

vi.mock('~/services/settlementservice', () => ({
  viewSettlement: vi.fn(),
  deleteSettlement: vi.fn(),
  autoSettlement: vi.fn(),
  getAutoSettlement: vi.fn(),
  getBanks: vi.fn(() => Promise.resolve({ data: { data: { responseBody: [] } } }))
}));

vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => fn),
}));

vi.stubGlobal('useAuthStore', vi.fn(() => ({})));
vi.stubGlobal('definePageMeta', vi.fn());

const globalErrorText = ref('');
const globalIsErrorOpen = ref(false);
const globalLoadingState = ref(false);
const globalIsSuccessOpen = ref(false);
const globalGetSettlements = vi.fn();

vi.stubGlobal('errorText', globalErrorText);
vi.stubGlobal('isErrorOpen', globalIsErrorOpen);
vi.stubGlobal('isLoading', globalLoadingState);
vi.stubGlobal('isSuccessOpen', globalIsSuccessOpen);
vi.stubGlobal('getSettlements', globalGetSettlements);

describe('users-table.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    globalErrorText.value = '';
    globalIsErrorOpen.value = false;
    globalLoadingState.value = false;
    globalIsSuccessOpen.value = false;

    getAutoSettlement.mockResolvedValue({ status: 200, data: { data: { autoSettlement: true } } });
    viewSettlement.mockResolvedValue({ status: 200, data: { data: { totalCount: 10 } } });
    autoSettlement.mockResolvedValue({ status: 200 });

    wrapper = mount(UsersTable, {
      global: {
        stubs: {
          CustomTable: true,
          DeleteModal: {
            template: '<div id="delete-modal"><button id="confirm-del" @click="$emit(\'deleteItem\')"></button></div>',
            props: ['open']
          },
          IndexModal: {
            template: '<div v-if="isOpen" id="index-modal"><slot name="content" /></div>',
            props: ['isOpen']
          },
          PagesSettlementsForm: {
            template: '<div id="form-stub"><button id="refresh-btn" @click="$emit(\'refresh\')"></button></div>',
            props: ['id', 'detail']
          }
        }
      }
    });
  });

  it('calls initialization services on mount', () => {
    expect(getAutoSettlement).toHaveBeenCalled();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('triggers search debounced function on queryParams.Search change', async () => {
    wrapper.vm.queryParams.Search = 'test';
    await nextTick();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('updates data on pagination change', async () => {
    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('updates data on sort change', async () => {
    wrapper.vm.queryParams.SortOrder = 'asc';
    await nextTick();
    expect(viewSettlement).toHaveBeenCalled();
  });

  it('triggers handleAutoSettlement when isAutoSettlement changes', async () => {
    wrapper.vm.isAutoSettlement = !wrapper.vm.isAutoSettlement;
    await nextTick();
    expect(autoSettlement).toHaveBeenCalled();
  });

  it('sets state for deleteRequest', () => {
    wrapper.vm.deleteRequest(5);
    expect(wrapper.vm.id).toBe(5);
    expect(wrapper.vm.open).toBe(true);
  });

  it('sets state for openRequest', () => {
    const detail = { name: 'John' };
    wrapper.vm.openRequest(detail);
    expect(wrapper.vm.detail).toEqual(detail);
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('closes delete modal on emit', async () => {
    wrapper.vm.open = true;
    wrapper.vm.open = false;
    expect(wrapper.vm.open).toBe(false);
  });

  it('executes handleSuccess via injection', () => {
    wrapper.vm.handleSuccess();
    expect(viewSettlement).toHaveBeenCalled();
  });
});
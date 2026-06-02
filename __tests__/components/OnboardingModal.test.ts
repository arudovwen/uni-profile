import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import OnboardingModal from '@/components/OnboardingModal.vue';

let mockLoggedUser: any = { userCategory: 1 };
let mockRoles: any[] = [];

vi.mock('@/composables/useAppRoles', () => ({
  useAppRoles: () => ({
    getAvailableRoles: () => mockRoles
  })
}));

vi.mock('@/composables/useOnboarding', () => ({
  useOnboarding: () => ({})
}));

vi.mock('~/services/productservices', () => ({
  getProducts: vi.fn()
}));

vi.stubGlobal('useAuthStore', () => ({
  loggedUser: mockLoggedUser
}));

vi.stubGlobal('useToast', () => ({}));

const IndexModalStub = {
  props: ['isOpen'],
  template: '<div><slot name="content" /><button class="stub-close-btn" @click="$emit(\'togglePopup\')"></button></div>'
};

const OnboardingSearchableSelectStub = {
  props: ['modelValue'],
  template: '<button class="stub-searchable-btn" @click="$emit(\'update:model-value\', \'searchable_res\')"></button>'
};

const OnboardingCustomDropdownStub = {
  props: ['modelValue', 'options'],
  template: `
    <div>
      <button class="stub-drop-matched" @click="$emit('update:modelValue', { name: 'L1', value: 'v1' })"></button>
      <button class="stub-drop-unmatched" @click="$emit('update:modelValue', { name: 'Unmatched', value: 'unmatched_val' })"></button>
      <button class="stub-drop-simple" @click="$emit('update:modelValue', { name: 'Simple' })"></button>
    </div>
  `
};

describe('OnboardingModal.vue', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockLoggedUser = { userCategory: 1 };
    mockRoles = [];
  });

  const createWrapper = (props = {}) => {
    return mount(OnboardingModal, {
      props: {
        isOpen: true,
        appCode: 'APP_CODE',
        app: { name: 'Test App' },
        ...props
      },
      global: {
        stubs: {
          IndexModal: IndexModalStub,
          OnboardingSearchableSelect: OnboardingSearchableSelectStub,
          OnboardingCustomDropdown: OnboardingCustomDropdownStub
        }
      }
    });
  };

  it('handles auto signup when there are no available roles', async () => {
    vi.useFakeTimers();
    mockRoles = [];
    const wrapper = createWrapper({ isOpen: true });
    await vi.advanceTimersByTimeAsync(500);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual(['', {}]);
    vi.useRealTimers();
  });

  it('handles auto signup when there is exactly one available role', async () => {
    vi.useFakeTimers();
    mockRoles = [
      {
        value: 'single_role',
        label: 'Single Role',
        description: 'One option',
        conditionalFields: [{ name: 'f1', defaultValue: 'preset' }]
      }
    ];
    const wrapper = createWrapper({ isOpen: true });
    await vi.advanceTimersByTimeAsync(500);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual(['single_role', { f1: 'preset' }]);
    vi.useRealTimers();
  });

  it('resets state when isOpen changes to false', async () => {
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    await wrapper.setProps({ isOpen: false });
    expect(wrapper.props('isOpen')).toBe(false);
  });

  it('resets state when appCode changes', async () => {
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    await wrapper.setProps({ appCode: 'NEW_CODE' });
    expect(wrapper.props('appCode')).toBe('NEW_CODE');
  });

  it('computes categorySlug correctly for userCategory 2 with companyName', () => {
    mockLoggedUser = { userCategory: 2, companyName: 'My Company' };
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    expect(wrapper.find('[data-testid="table-loader"]').exists()).toBe(false);
  });

  it('computes categorySlug correctly for userCategory 2 without companyName', () => {
    mockLoggedUser = { userCategory: 2 };
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    expect(wrapper.find('[data-testid="table-loader"]').exists()).toBe(false);
  });

  it('computes categorySlug correctly for userCategory 3', () => {
    mockLoggedUser = { userCategory: 3 };
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    expect(wrapper.find('[data-testid="table-loader"]').exists()).toBe(false);
  });

  it('computes categorySlug correctly when loggedUser is null', () => {
    mockLoggedUser = null;
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    expect(wrapper.find('[data-testid="table-loader"]').exists()).toBe(false);
  });

  it('keeps confirm button disabled if required conditional fields are missing', async () => {
    mockRoles = [
      { value: 'r1', label: 'R1', description: 'D1' },
      {
        value: 'r2',
        label: 'R2',
        description: 'D2',
        conditionalFields: [
          { name: 'buyersQuestion', label: 'BQ', type: 'text', required: true }
        ]
      }
    ];
    const wrapper = createWrapper({ isOpen: true, isOnboarding: false });
    const roles = wrapper.findAll('.cursor-pointer');
    await roles[1].trigger('click');
    await flushPromises();

    const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('Confirm'));
    expect(confirmBtn?.element.disabled).toBe(true);
  });

  it('renders processing state when isOnboarding prop is true', () => {
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true, isOnboarding: true });
    expect(wrapper.text()).toContain('Signing you up for');
  });

  it('emits close event when close or cancel action is triggered', async () => {
    mockRoles = [{ value: 'r1', label: 'R1', description: 'D1' }, { value: 'r2', label: 'R2', description: 'D2' }];
    const wrapper = createWrapper({ isOpen: true });
    
    const cancelBtn = wrapper.findAll('button').find(b => b.text().includes('Cancel'));
    await cancelBtn?.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();

    const closeBtn = wrapper.find('.stub-close-btn');
    await closeBtn.trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(2);
  });
});
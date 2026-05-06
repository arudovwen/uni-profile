import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CustomVueSelect from '@/components/Select/CustomVueSelect.vue';

const vSelectStub = {
  name: 'vSelect',
  template: '<div class="v-select-stub"></div>',
  props: ['name', 'error', 'id', 'readonly', 'disabled', 'validate', 'multiple', 'options', 'modelValue']
};

const AppIconStub = {
  name: 'AppIcon',
  template: '<div class="app-icon-stub"></div>',
  props: ['icon']
};

const RedDotStub = {
  name: 'RedDot',
  template: '<div class="red-dot-stub"></div>'
};

describe('CustomVueSelect.vue', () => {
  const defaultProps = {
    name: 'test-select',
    options: ['Option 1', 'Option 2']
  };

  const createWrapper = (props = {}, options = {}) => {
    return mount(CustomVueSelect, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          vSelect: vSelectStub,
          AppIcon: AppIconStub,
          RedDot: RedDotStub,
          redDot: RedDotStub,
          appIcon: AppIconStub
        },
        mocks: {
          $store: {
            dispatch: vi.fn()
          }
        }
      },
      ...options
    });
  };

  it('renders correctly with base props', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.v-select-stub').exists()).toBe(true);
    expect(wrapper.classes()).toContain('formGroup');
  });

  it('applies error, horizontal, and validate classes', () => {
    const wrapper = createWrapper({
      error: 'Error message',
      horizontal: true,
      validate: 'Valid message'
    });
    expect(wrapper.classes()).toContain('has-error');
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('is-valid');
  });

  it('dispatches store action when request span is clicked', async () => {
    const dispatchSpy = vi.fn();
    const wrapper = createWrapper({
      label: 'Label',
      canRequest: true,
      request: { name: 'Add New', toggle: 'toggleAction' }
    });
    wrapper.vm.$store.dispatch = dispatchSpy;

    const requestSpan = wrapper.find('label span');
    await requestSpan.trigger('click');
    expect(dispatchSpy).toHaveBeenCalledWith('toggleAction', true);
  });

  it('shows loading state and hides vSelect', () => {
    const wrapper = createWrapper({ menuLoading: true });
    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.find('.v-select-stub').exists()).toBe(false);
  });

  it('emits update:modelValue when vSelect emits', async () => {
    const wrapper = createWrapper();
    const select = wrapper.findComponent({ name: 'vSelect' });
    await select.vm.$emit('update:modelValue', 'Option 1');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Option 1']);
  });

  it('renders error and validate messages with tooltip styles', () => {
    const wrapper = createWrapper({
      error: 'Error Msg',
      validate: 'Valid Msg',
      msgTooltip: true
    });
    const spans = wrapper.findAll('span.mt-2');
    expect(spans[0].classes()).toContain('bg-danger-500');
    expect(spans[1].classes()).toContain('bg-success-500');
  });

  it('renders error and validate messages with default styles', () => {
    const wrapper = createWrapper({
      error: 'Error Msg',
      validate: 'Valid Msg',
      msgTooltip: false
    });
    const spans = wrapper.findAll('span.mt-2');
    expect(spans[0].classes()).toContain('text-danger-500');
    expect(spans[1].classes()).toContain('text-success-500');
  });

  it('renders description when provided', () => {
    const wrapper = createWrapper({ description: 'Helper text' });
    expect(wrapper.find('.text-secondary-500').text()).toBe('Helper text');
  });

  it('renders default slot instead of vSelect when provided', () => {
    const wrapper = createWrapper({}, {
      slots: {
        default: '<div class="custom-slot">Custom Content</div>'
      }
    });
    expect(wrapper.find('.custom-slot').exists()).toBe(true);
    expect(wrapper.find('.v-select-stub').exists()).toBe(false);
  });

  it('passes all specific props to vSelect', () => {
    const wrapper = createWrapper({
      isReadonly: true,
      disabled: true,
      multiple: true,
      modelValue: 'Selected Val'
    });
    const select = wrapper.findComponent({ name: 'vSelect' });
    expect(select.props('readonly')).toBe(true);
    expect(select.props('disabled')).toBe(true);
    expect(select.props('multiple')).toBe(true);
    expect(select.props('modelValue')).toBe('Selected Val');
  });
});
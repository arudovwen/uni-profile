import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SelectComponent from '@/components/Select/index.vue';

const AppIconStub = {
  name: 'AppIcon',
  template: '<div class="app-icon-stub"></div>',
  props: ['icon']
};

const RedDotStub = {
  name: 'RedDot',
  template: '<div class="red-dot-stub"></div>'
};

describe('Select/index.vue', () => {
  const defaultProps = {
    name: 'test-select',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]
  };

  const createWrapper = (props = {}, options = {}) => {
    return mount(SelectComponent, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          AppIcon: AppIconStub,
          'app-icon': AppIconStub,
          RedDot: RedDotStub,
          'red-dot': RedDotStub
        }
      },
      ...options
    });
  };

  it('handles state classes for error, horizontal, and validate', () => {
    const wrapper = createWrapper({
      error: 'Error text',
      horizontal: true,
      validate: 'Valid text'
    });
    expect(wrapper.classes()).toContain('has-error');
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('is-valid');
  });

  it('emits update:modelValue on input change', async () => {
    const wrapper = createWrapper();
    const select = wrapper.find('select');
    await select.setValue('2');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2']);
  });

  it('renders options correctly from props', () => {
    const wrapper = createWrapper();
    const options = wrapper.findAll('option');
    expect(options.length).toBe(3);
    expect(options[1].attributes('value')).toBe('1');
    expect(options[1].text()).toBe('Option 1');
  });

  it('renders slot content instead of options prop when provided', () => {
    const wrapper = createWrapper({}, {
      slots: {
        default: '<option value="slot-val">Slot Option</option>'
      }
    });
    const options = wrapper.findAll('option');
    expect(wrapper.find('option[value="slot-val"]').exists()).toBe(true);
    expect(options.some(opt => opt.text() === 'Option 1')).toBe(false);
  });

  it('applies tooltip styles to error and validate spans', () => {
    const wrapper = createWrapper({
      error: 'Fail',
      validate: 'Pass',
      msgTooltip: true
    });
    const spans = wrapper.findAll('span.mt-2');
    expect(spans[0].classes()).toContain('bg-danger-500');
    expect(spans[1].classes()).toContain('bg-success-500');
  });

  it('applies default text styles when msgTooltip is false', () => {
    const wrapper = createWrapper({
      error: 'Fail',
      validate: 'Pass',
      msgTooltip: false
    });
    const spans = wrapper.findAll('span.mt-2');
    expect(spans[0].classes()).toContain('text-danger-500');
    expect(spans[1].classes()).toContain('text-success-500');
  });

  it('renders description text', () => {
    const wrapper = createWrapper({ description: 'Helpful info' });
    expect(wrapper.find('.text-secondary-500').text()).toBe('Helpful info');
  });

  it('applies select attributes correctly', () => {
    const wrapper = createWrapper({
      isReadonly: true,
      disabled: true,
      multiple: true,
      size: '5'
    });
    const select = wrapper.find('select');
    expect(select.attributes('readonly')).toBeDefined();
    expect(select.element.disabled).toBe(true);
    expect(select.element.multiple).toBe(true);
    expect(select.attributes('size')).toBe('5');
  });

  it('uses default formatter if not provided', () => {
    const wrapper = createWrapper();
    expect(wrapper.props().formatter('test')).toBe('test');
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VueSelect from '@/components/Select/VueSelect.vue';
import vSelect from 'vue-select';

const RedDotStub = { name: 'RedDot', template: '<span class="red-dot-stub" />' };
const AppIconStub = { name: 'AppIcon', props: ['icon'], template: '<span class="app-icon-stub" :data-icon="icon" />' };

describe('VueSelect.vue', () => {
  const globalOptions = {
    global: {
      stubs: { vSelect },
      components: {
        RedDot: RedDotStub,
        AppIcon: AppIconStub
      }
    }
  };

  it('renders correctly with base props', () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      props: {
        id: 'test-id',
        name: 'test-name',
        containerClass: 'custom-container'
      }
    });

    expect(wrapper.find('.formGroup').classes()).toContain('custom-container');

    const select = wrapper.findComponent(vSelect);
    expect(select.exists()).toBe(true);
    expect(select.attributes('id')).toBe('test-id');
    expect(select.attributes('name')).toBe('test-name');
  });

  it('applies tooltip classes based on msgTooltip prop', () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      props: { error: 'Error', validate: 'Valid', msgTooltip: true }
    });

    expect(wrapper.find('span.bg-danger-500').exists()).toBe(true);
    expect(wrapper.find('span.bg-success-500').exists()).toBe(true);
  });

  it('renders description when provided', () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      props: { description: 'Helpful text' }
    });
    expect(wrapper.find('.text-secondary-500').text()).toBe('Helpful text');
  });

  it('renders slot content and hides vSelect', () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      slots: { default: '<div class="custom-slot">Slot Content</div>' }
    });
    expect(wrapper.find('.custom-slot').exists()).toBe(true);
    expect(wrapper.findComponent(vSelect).exists()).toBe(false);
  });

  it('syncs internal selectedValue with modelValue prop', async () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      props: { modelValue: 'Initial' }
    });

    const select = wrapper.findComponent(vSelect);
    expect(select.props('modelValue')).toBe('Initial');

    await wrapper.setProps({ modelValue: 'Updated' });
    expect(select.props('modelValue')).toBe('Updated');
  });

  it('emits update:modelValue when vSelect changes', async () => {
    const wrapper = mount(VueSelect, { ...globalOptions });
    const select = wrapper.findComponent(vSelect);

    await select.vm.$emit('update:modelValue', 'New Value');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New Value']);
  });

  it('handles disabled state opacity', () => {
    const wrapper = mount(VueSelect, {
      ...globalOptions,
      props: { disabled: true }
    });
    expect(wrapper.find('.opacity-60').exists()).toBe(true);
  });

  it('verifies reduce default behavior', () => {
    const wrapper = mount(VueSelect, { ...globalOptions });
    const reduceFunc = wrapper.props('reduce') as (v: unknown) => unknown;
    expect(reduceFunc('test')).toBe('test');
  });
});
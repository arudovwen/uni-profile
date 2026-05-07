import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PhoneCodes from '@/components/forms/PhoneCodes.vue';

describe('PhoneCodes.vue', () => {
  const stubs = {
    Listbox: {
      props: ['modelValue'],
      template: '<div><slot /></div>'
    },
    ListboxButton: {
      template: '<button class="lb-button"><slot /></button>'
    },
    ListboxOptions: {
      template: '<ul><slot /></ul>'
    },
    ListboxOption: {
      props: ['value'],
      template: '<li class="lb-option"><slot :selected="false" /></li>'
    },
    RedDot: { template: '<span class="red-dot" />' },
    AppIcon: { template: '<i class="app-icon" />' }
  };

  it('renders info icon when info prop is true', () => {
    const wrapper = mount(PhoneCodes, {
      props: { label: 'Phone', info: true, infoTitle: 'Hint' },
      global: { stubs }
    });
    expect(wrapper.find('[title="Hint"]').exists()).toBe(true);
  });

  it('applies horizontal classes to label', () => {
    const wrapper = mount(PhoneCodes, {
      props: { label: 'Phone', horizontal: true },
      global: { stubs }
    });
    expect(wrapper.find('label').attributes('class')).toContain('flex-0');
  });

  it('initializes code and phone from modelValue on mount', () => {
    const wrapper = mount(PhoneCodes, {
      props: { modelValue: '+1-123456' },
      global: { stubs }
    });
    expect(wrapper.vm.code).toBe('+1');
    expect(wrapper.vm.phone).toBe('123456');
  });

  it('handles modelValue without hyphen on mount', () => {
    const wrapper = mount(PhoneCodes, {
      props: { modelValue: '987654' },
      global: { stubs }
    });
    expect(wrapper.vm.code).toBe('+234');
    expect(wrapper.vm.phone).toBe('987654');
  });

  it('updates values when modelValue prop changes', async () => {
    const wrapper = mount(PhoneCodes, {
      props: { modelValue: '+234-1' },
      global: { stubs }
    });
    await wrapper.setProps({ modelValue: '+44-999' });
    expect(wrapper.vm.code).toBe('+44');
    expect(wrapper.vm.phone).toBe('999');
  });

  it('handles empty modelValue update', async () => {
    const wrapper = mount(PhoneCodes, {
      props: { modelValue: '+234-1' },
      global: { stubs }
    });
    await wrapper.setProps({ modelValue: '' });
    expect(wrapper.vm.code).toBe('+234');
  });

  it('filters country codes based on search query', async () => {
    const wrapper = mount(PhoneCodes, {
      props: { label: 'Phone' },
      global: { stubs }
    });
    wrapper.vm.query = 'Nigeria';
    expect(wrapper.vm.filteredCodes.every(c => c.name.toLowerCase().includes('nigeria'))).toBe(true);
    
    wrapper.vm.query = '';
    expect(wrapper.vm.filteredCodes.length).toBeGreaterThan(1);
  });

  it('emits update:modelValue when code or phone changes', async () => {
    const wrapper = mount(PhoneCodes, {
      props: { modelValue: '+234-000' },
      global: { stubs }
    });
    
    wrapper.vm.phone = '111';
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['+234-111']);

    wrapper.vm.code = '+1';
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')[1]).toEqual(['+1-111']);
  });

  it('shows placeholder when code is null', async () => {
    const wrapper = mount(PhoneCodes, {
      props: { placeholder: 'Select code' },
      global: { stubs }
    });
    wrapper.vm.code = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.lb-button').text()).toContain('Select code');
  });

  it('renders all filtered options in ListboxOptions', async () => {
    const wrapper = mount(PhoneCodes, {
      global: { stubs }
    });
    wrapper.vm.query = 'United';
    await wrapper.vm.$nextTick();
    const options = wrapper.findAll('.lb-option');
    expect(options.length).toBe(wrapper.vm.filteredCodes.length);
  });
});
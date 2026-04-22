import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MultiSelectComponent from '@/components/forms/MultiSelectComponent.vue';

describe('MultiSelectComponent.vue', () => {
  const options = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ];

  const stubs = {
    Combobox: {
      props: ['modelValue', 'multiple'],
      template: '<div><slot /></div>'
    },
    ComboboxInput: {
      name: 'ComboboxInput',
      props: ['placeholder', 'displayValue'],
      template: '<input class="cb-input" />'
    },
    ComboboxOptions: {
      template: '<ul><slot /></ul>'
    },
    ComboboxOption: {
      name: 'ComboboxOption',
      props: ['value'],
      template: '<li class="cb-option"><slot /></li>'
    },
    CheckIcon: {
      template: '<i class="check-icon-marker"></i>'
    }
  };

  it('initializes with the first two options and renders tags', () => {
    const wrapper = mount(MultiSelectComponent, {
      props: { options },
      global: { stubs }
    });

    const tags = wrapper.findAll('li.px-3');
    expect(tags).toHaveLength(2);
    expect(tags[0].text()).toBe('Option 1');
    expect(tags[1].text()).toBe('Option 2');
  });

  it('renders all options in the list with correct active classes', () => {
    const wrapper = mount(MultiSelectComponent, {
      props: { options },
      global: { stubs }
    });

    const listItems = wrapper.findAll('.cb-option');
    expect(listItems).toHaveLength(3);
    
    expect(listItems[0].classes()).toContain('bg-gray-50');
    
    const item3Classes = listItems[2].attributes('class').split(' ');
    expect(item3Classes).not.toContain('bg-gray-50');
    expect(item3Classes).toContain('hover:bg-gray-50');
  });

  it('emits onGetData when selectedOptions changes', async () => {
    const wrapper = mount(MultiSelectComponent, {
      props: { options },
      global: { stubs }
    });

    wrapper.vm.selectedOptions = [...options];
    await wrapper.vm.$nextTick();
    
    expect(wrapper.emitted('onGetData')).toBeTruthy();
    expect(wrapper.emitted('onGetData')[0][0]).toEqual(options);
  });

  it('uses the placeholder prop in ComboboxInput', () => {
    const placeholder = "Search here";
    const wrapper = mount(MultiSelectComponent, {
      props: { options, placeholder },
      global: { stubs }
    });

    const input = wrapper.findComponent({ name: 'ComboboxInput' });
    expect(input.props('placeholder')).toBe(placeholder);
  });

  it('displayValue function returns the name property', () => {
    const wrapper = mount(MultiSelectComponent, {
      props: { options },
      global: { stubs }
    });
    
    const input = wrapper.findComponent({ name: 'ComboboxInput' });
    const displayValue = input.props('displayValue');
    expect(displayValue(options[0])).toBe('Option 1');
  });
});
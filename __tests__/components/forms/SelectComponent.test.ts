import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SelectComponent from '@/components/forms/SelectComponent.vue';

describe('SelectComponent.vue', () => {
  const options = [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' }
  ];

  const stubs = {
    Listbox: {
      props: ['modelValue'],
      template: '<div><slot /></div>'
    },
    ListboxButton: {
      template: '<button class="lb-button"><slot /></button>'
    },
    ListboxOptions: {
      template: '<ul class="lb-options"><slot /></ul>'
    },
    ListboxOption: {
      props: ['value'],
      template: '<div class="lb-option"><slot :active="true" :selected="true" /></div>'
    },
    CheckIcon: { 
      name: 'CheckIcon',
      template: '<span class="check-icon-stub"></span>' 
    }
  };

  it('initializes selectedoption from props.value on mount', () => {
    const wrapper = mount(SelectComponent, {
      props: { options, value: 'banana' },
      global: { stubs }
    });
    expect(wrapper.vm.selectedoption.name).toBe('Banana');
  });

  it('renders placeholder when no option is selected', () => {
    const wrapper = mount(SelectComponent, {
      props: { options, placeholder: 'Test Placeholder' },
      global: { stubs }
    });
    expect(wrapper.find('.lb-button').text()).toContain('Test Placeholder');
  });

  it('filters options based on query when showSearch is true', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options, showSearch: true },
      global: { stubs }
    });
    
    expect(wrapper.vm.filteredOption).toHaveLength(2);
    wrapper.vm.query = 'app';
    expect(wrapper.vm.filteredOption).toHaveLength(1);
    expect(wrapper.vm.filteredOption[0].name).toBe('Apple');
  });

  it('displays "No options available" when filteredOption is empty', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options: [], showSearch: true },
      global: { stubs }
    });
    wrapper.vm.query = 'missing';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('No options available');
  });

  it('emits onGetData when selectedoption changes', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options },
      global: { stubs }
    });
    
    wrapper.vm.selectedoption = options[0];
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('onGetData')[0]).toEqual([options[0]]);
  });

  it('updates selectedoption when props.value changes externally', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options, value: 'apple' },
      global: { stubs }
    });

    await wrapper.setProps({ value: 'banana' });
    expect(wrapper.vm.selectedoption.value).toBe('banana');
  });

  it('applies containerStyle and classStyles props', () => {
    const wrapper = mount(SelectComponent, {
      props: { 
        options, 
        containerStyle: 'custom-container',
        classStyles: 'custom-button'
      },
      global: { stubs }
    });

    expect(wrapper.find('.custom-container').exists()).toBe(true);
    expect(wrapper.find('.custom-button').exists()).toBe(true);
  });

  it('handles lowercase comparison when updating from props.value', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options, value: 'APPLE' },
      global: { stubs }
    });
    
    await wrapper.setProps({ value: 'BANANA' });
    expect(wrapper.vm.selectedoption.name).toBe('Banana');
  });

  it('does not emit onGetData if selectedoption is set to null', async () => {
    const wrapper = mount(SelectComponent, {
      props: { options },
      global: { stubs }
    });
    
    wrapper.vm.selectedoption = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('onGetData')).toBeUndefined();
  });
});
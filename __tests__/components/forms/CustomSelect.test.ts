import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CustomSelect from '@/components/forms/CustomSelect.vue';

describe('CustomSelect.vue', () => {
  const options = [
    { id: 1, text1: 'Option 1', text2: 'Sub 1', text3: 'Desc 1' },
    { id: 2, text1: 'Option 2', text2: 'Sub 2' }
  ];

  const mountOptions = {
    global: {
      stubs: {
        transition: false,
        Listbox: { template: '<div><slot /></div>' },
        ListboxButton: { template: '<button><slot /></button>' },
        ListboxOptions: { template: '<div><slot /></div>' },
        ListboxOption: { template: '<div><slot :active="false" :selected="false" /></div>' },
        ChevronDownIcon: true
      }
    }
  };

  it('renders placeholder when no value is selected', () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: {
        placeholder: 'Select an option',
        options: options,
        modelValue: null
      }
    });
    expect(wrapper.find('button').text()).toContain('Select an option');
  });

  it('sets initial value on mount', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: {
        options,
        modelValue: 1
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedOption).toEqual(options[0]);
    expect(wrapper.find('button').text()).toContain('Option 1');
    expect(wrapper.find('button').text()).toContain('Sub 1');
  });

  it('emits events when selection changes', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: {
        id: 'test-select',
        options,
        modelValue: null
      }
    });
    wrapper.vm.selectedOption = options[1];
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([2]);
    expect(wrapper.emitted('onGetData')[0]).toEqual([options[1], 'test-select']);
  });

  it('updates selection when modelValue prop changes', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: { options, modelValue: 1 }
    });
    await wrapper.setProps({ modelValue: 2 });
    expect(wrapper.vm.selectedOption).toEqual(options[1]);
  });

  it('handles empty modelValue prop change', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: { options, modelValue: 1 }
    });
    await wrapper.setProps({ modelValue: null });
    expect(wrapper.vm.selectedOption).toEqual(options[0]); 
  });

  it('updates selection when options array changes', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: { options, modelValue: 1 }
    });
    const newOptions = [...options];
    await wrapper.setProps({ options: newOptions });
    expect(wrapper.vm.selectedOption.id).toBe(1);
  });

  it('renders "No option" when options array is empty', () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: {
        options: [],
        modelValue: null
      }
    });
    expect(wrapper.text()).toContain('No option');
  });

  it('does not emit if selectedOption name is null', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: { options, modelValue: null }
    });
    wrapper.vm.selectedOption = { id: null };
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('handles options with text3', async () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: {
        options: [options[0]],
        modelValue: 1
      }
    });
    expect(wrapper.text()).toContain('Desc 1');
    expect(wrapper.text()).toContain('-');
  });

  it('returns empty object in onMounted if no modelValue', () => {
    const wrapper = mount(CustomSelect, {
      ...mountOptions,
      props: { options, modelValue: null }
    });
    expect(wrapper.vm.selectedOption).toBe(null);
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import StatesSelect from '@/components/forms/StatesSelect.vue';

describe('StatesSelect.vue', () => {
  const states = [
    { name: 'Lagos' },
    { name: 'Abuja' },
    { name: 'Kano' }
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
      template: '<div class="lb-options"><slot /></div>'
    },
    ListboxOption: {
      props: ['value'],
      template: `
        <div class="lb-option">
          <slot :active="true" :selected="value.name === 'Lagos'" />
        </div>`
    }
  };

  it('initializes selectedOption on mount when modelValue is provided', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: 'Abuja' },
      global: { stubs }
    });
    
    await nextTick();
    expect(wrapper.vm.selectedOption).toEqual({ name: 'Abuja' });
    expect(wrapper.find('.lb-button').text()).toContain('Abuja');
  });

  it('renders placeholder when no option is selected', () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: '', placeholder: 'Select State' },
      global: { stubs }
    });
    expect(wrapper.find('.lb-button').text()).toContain('Select State');
  });

  it('filters states based on search query', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states },
      global: { stubs }
    });
    
    wrapper.vm.query = 'lag';
    expect(wrapper.vm.filteredStates).toHaveLength(1);
    expect(wrapper.vm.filteredStates[0].name).toBe('Lagos');
  });

  it('emits update:modelValue when selectedOption changes', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states },
      global: { stubs }
    });

    wrapper.vm.selectedOption = { name: 'Kano' };
    await nextTick();

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Kano']);
  });

  it('updates selectedOption when modelValue prop changes', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: 'Lagos' },
      global: { stubs }
    });

    await wrapper.setProps({ modelValue: 'Abuja' });
    expect(wrapper.vm.selectedOption.name).toBe('Abuja');
  });

  it('updates selectedOption when states prop changes', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: 'Lagos' },
      global: { stubs }
    });

    await wrapper.setProps({ states: [...states, { name: 'Ogun' }] });
    expect(wrapper.vm.selectedOption.name).toBe('Lagos');
  });

  it('handles empty modelValue in watchers and mount', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: null },
      global: { stubs }
    });
    expect(wrapper.vm.selectedOption).toBeNull();

    await wrapper.setProps({ modelValue: '' });
    expect(wrapper.vm.selectedOption).toBeNull();
  });

  it('applies active and selected classes in ListboxOption', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states, modelValue: 'Lagos' },
      global: { stubs }
    });

    await nextTick();
    const optionContainer = wrapper.find('.lb-option span');
    expect(optionContainer.classes()).toContain('bg-gray-50');
    expect(optionContainer.find('.uil-check').isVisible()).toBe(true);
  });

  it('applies classStyles to the button', () => {
    const wrapper = mount(StatesSelect, {
      props: { states, classStyles: 'custom-border' },
      global: { stubs }
    });
    expect(wrapper.find('.lb-button').classes()).toContain('custom-border');
  });

  it('does not emit update if selectedOption name is null', async () => {
    const wrapper = mount(StatesSelect, {
      props: { states },
      global: { stubs }
    });

    wrapper.vm.selectedOption = { name: null };
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
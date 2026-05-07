import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CountriesSelect from '@/components/forms/CountriesSelect.vue';

vi.mock('~/utils/countries.json', () => ({
  default: [
    { name: 'Nigeria' },
    { name: 'United States' },
    { name: 'Canada' }
  ]
}));

describe('CountriesSelect.vue', () => {
  const mountOptions = {
    global: {
      stubs: {
        transition: false,
        Listbox: { template: '<div><slot /></div>' },
        ListboxButton: { template: '<button><slot /></button>' },
        ListboxOptions: { template: '<div><slot /></div>' },
        ListboxOption: { template: '<div><slot :active="false" :selected="false" /></div>' }
      }
    }
  };

  it('renders placeholder when no value is selected', () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: {
        placeholder: 'Select Country',
        modelValue: null
      }
    });
    expect(wrapper.find('button').text()).toContain('Select Country');
  });

  it('sets initial value on mount', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: 'Nigeria' }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedOption).toEqual({ name: 'Nigeria' });
    expect(wrapper.find('button').text()).toContain('Nigeria');
  });

  it('updates selectedOption when modelValue prop changes', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: 'Nigeria' }
    });
    await wrapper.setProps({ modelValue: 'Canada' });
    expect(wrapper.find('button').text()).toContain('Canada');
  });

  it('handles empty modelValue prop change', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: 'Nigeria', placeholder: 'Select' }
    });
    await wrapper.setProps({ modelValue: '' });
    wrapper.vm.selectedOption = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('button').text()).toContain('Select');
  });

  it('filters countries list based on search query', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: null }
    });
    const input = wrapper.find('input');
    await input.setValue('Can');
    expect(wrapper.vm.filteredCountries).toEqual([{ name: 'Canada' }]);
  });

  it('emits update:modelValue when an option is selected', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: null }
    });
    wrapper.vm.selectedOption = { name: 'Nigeria' };
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Nigeria']);
  });

  it('returns empty object if onMounted finds no modelValue', () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: null }
    });
    expect(wrapper.vm.selectedOption).toBe(null);
  });

  it('does not emit update if selectedOption name is null', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: null }
    });
    wrapper.vm.selectedOption = { name: null };
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('triggers watcher when modelValue changes to valid country', async () => {
    const wrapper = mount(CountriesSelect, {
      ...mountOptions,
      props: { modelValue: 'United States' }
    });
    await wrapper.setProps({ modelValue: 'Nigeria' });
    expect(wrapper.vm.selectedOption.name).toBe('Nigeria');
  });
});
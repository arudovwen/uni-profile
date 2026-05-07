import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MultiFilter from '@/components/forms/MultiFilter.vue';

describe('MultiFilter.vue', () => {
  const options = [
    { name: 'Option 1', value: '1' },
    { name: 'Option 2', value: '2' }
  ];

  const clickOutsideMock = vi.fn();

  const mountOptions = (props = {}) => ({
    props: {
      options,
      placeholder: 'Select Item',
      ...props
    },
    global: {
      directives: {
        'click-outside': clickOutsideMock
      }
    }
  });

  it('toggles visibility when clicked', async () => {
    const wrapper = mount(MultiFilter, mountOptions());
    const trigger = wrapper.find('.cursor-default');
    
    await trigger.trigger('click');
    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.find('div[style*="display: none"]').exists()).toBe(false);

    await trigger.trigger('click');
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('renders placeholder when no option is selected', () => {
    const wrapper = mount(MultiFilter, mountOptions());
    expect(wrapper.text()).toContain('Select Item');
  });

  it('renders selected value when an option is picked', async () => {
    const wrapper = mount(MultiFilter, mountOptions());
    wrapper.vm.selectedoption = options[0];
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('1');
  });

  it('filters options based on search query', async () => {
    const wrapper = mount(MultiFilter, mountOptions({ showSearch: true }));
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    const input = wrapper.find('input[placeholder="Search name..."]');
    await input.setValue('Option 2');

    expect(wrapper.vm.filteredOption).toHaveLength(1);
    expect(wrapper.vm.filteredOption[0].name).toBe('Option 2');
  });

  it('returns all options when search query is empty', () => {
    const wrapper = mount(MultiFilter, mountOptions({ showSearch: true }));
    wrapper.vm.query = '';
    expect(wrapper.vm.filteredOption).toHaveLength(2);
  });

  it('emits data and closes on save', async () => {
    const wrapper = mount(MultiFilter, mountOptions());
    wrapper.vm.isOpen = true;
    wrapper.vm.selectedoption = options[1];
    
    const saveBtn = wrapper.find('button.bg-primary-500');
    await saveBtn.trigger('click');

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.emitted('onGetData')[0]).toEqual([options[1]]);
  });

  it('handles "All" radio selection', async () => {
    const wrapper = mount(MultiFilter, mountOptions());
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    const allRadio = wrapper.find('input#All');
    await allRadio.setValue();

    expect(wrapper.vm.selectedoption).toBe("");
  });

  it('closes when v-click-outside is triggered', async () => {
    const wrapper = mount(MultiFilter, mountOptions());
    wrapper.vm.isOpen = true;
    
    const binding = { value: () => { wrapper.vm.isOpen = false; } };
    binding.value();
    
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('renders custom classStyles', () => {
    const wrapper = mount(MultiFilter, mountOptions({ classStyles: 'custom-class' }));
    expect(wrapper.find('.custom-class').exists()).toBe(true);
  });
});
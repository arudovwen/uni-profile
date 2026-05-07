import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SearchFilter from '@/components/forms/SearchFilter.vue';

describe('SearchFilter.vue', () => {
  const clickOutsideMock = vi.fn();

  const globalConfig = {
    directives: {
      'click-outside': clickOutsideMock
    }
  };

  it('shows empty state when options are empty', async () => {
    const wrapper = mount(SearchFilter, {
      global: globalConfig
    });
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('No saved search');
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('renders list when options exist and handles item click', async () => {
    const mockOptions = [
      { name: 'Ethanol', created: 'Created on Mar 15' }
    ];

    const wrapper = mount(SearchFilter, {
      global: globalConfig
    });

    wrapper.vm.isOpen = true;
    
    wrapper.vm.options.push(...mockOptions);
    await wrapper.vm.$nextTick();

    const listItem = wrapper.find('li');
    expect(listItem.text()).toContain('Ethanol');
    expect(listItem.text()).toContain('Created on Mar 15');

    const clickArea = wrapper.find('div[class="flex items-center justify-between"] > div');
    await clickArea.trigger('click');

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.emitted('onGetData')).toBeTruthy();
  });

  it('closes when click-outside directive is triggered', async () => {
    let clickOutsideHandler;
    const wrapper = mount(SearchFilter, {
      global: {
        directives: {
          'click-outside': (el, binding) => {
            clickOutsideHandler = binding.value;
          }
        }
      }
    });

    wrapper.vm.isOpen = true;
    clickOutsideHandler();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('renders delete button in list items', async () => {
    const wrapper = mount(SearchFilter, {
      global: globalConfig
    });
    wrapper.vm.options.push({ name: 'Test', created: 'Date' });
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('button.rounded-full').exists()).toBe(true);
    expect(wrapper.find('i.uil-times').exists()).toBe(true);
  });
});
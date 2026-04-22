import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AllFilter from '@/components/forms/AllFilter.vue';

describe('AllFilter.vue', () => {
  const defaultOptions = [
    { name: 'Option 1' },
    { name: 'Option 2' },
    { name: 'Testing' }
  ];

  it('renders and emits toggleClear', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });
    const btn = wrapper.findAll('button').find(b => b.text().trim() === 'x');
    await btn.trigger('click');
    expect(wrapper.emitted('toggleClear')).toBeTruthy();
  });

  it('emits toggleSave', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });
    const btn = wrapper.findAll('button').find(b => b.text().includes('Save'));
    await btn.trigger('click');
    expect(wrapper.emitted('toggleSave')).toBeTruthy();
  });

  it('emits cancel', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });
    const btn = wrapper.findAll('button').find(b => b.text().toLowerCase().includes('cancel'));
    await btn.trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('handles menu expansion and subcategory selection', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });
    
    const plusIcon = wrapper.find('.uil-plus');
    await plusIcon.trigger('click');
    expect(wrapper.find('.uil-minus').exists()).toBe(true);

    const subItem = wrapper.find('ul li ul li');
    await subItem.trigger('click');
    expect(wrapper.find('.uil-corner-down-right').exists()).toBe(true);

    await wrapper.find('.uil-minus').trigger('click');
    expect(wrapper.find('.uil-plus').exists()).toBe(true);
  });

  it('filters options based on search query', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });

    const input = wrapper.find('input[placeholder="Type property name..."]');
    await input.setValue('test');
    
    const listItems = wrapper.findAll('li label span');
    expect(listItems.length).toBe(1);
    expect(listItems[0].text()).toBe('Testing');
  });

  it('manages checkbox selection and clear all', async () => {
    const wrapper = mount(AllFilter, {
      props: { options: defaultOptions }
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    
    await checkboxes[0].setChecked();
    await checkboxes[1].setChecked();

    const selectedText = wrapper.find('span.text-\\[\\#ABABAB\\]');
    expect(selectedText.text()).toContain('2 selected');

    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('Clear all'));
    await clearBtn.trigger('click');
    
    expect(selectedText.text()).toContain('0 selected');
  });

  it('uses default props when not provided', () => {
    const wrapper = mount(AllFilter);
    expect(wrapper.props().filter).toBe(0);
    expect(wrapper.props().placeholder).toBe('Select');
  });
});
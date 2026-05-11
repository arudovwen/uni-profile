import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TabsComponent from '@/components/TabsComponent.vue';

describe('TabsComponent.vue', () => {
  const tabs = [
    { name: 'Tab 1', key: 'tab1' },
    { name: 'Tab 2', key: 'tab2' },
    { name: 'Tab 3', key: 'tab3' }
  ];

  it('renders correctly with default props', () => {
    const wrapper = mount(TabsComponent);
    const tabElements = wrapper.findAll('span');
    expect(tabElements).toHaveLength(1);
    expect(tabElements[0].text()).toBe('Active');
  });

  it('renders all provided tabs', () => {
    const wrapper = mount(TabsComponent, {
      props: { tabs }
    });
    const tabElements = wrapper.findAll('span');
    expect(tabElements).toHaveLength(3);
    expect(tabElements[0].text()).toBe('Tab 1');
    expect(tabElements[1].text()).toBe('Tab 2');
    expect(tabElements[2].text()).toBe('Tab 3');
  });

  it('applies active classes when activeTab matches tab key', () => {
    const wrapper = mount(TabsComponent, {
      props: { 
        tabs,
        activeTab: 'tab2'
      }
    });
    const tabElements = wrapper.findAll('span');
    
    expect(tabElements[0].classes()).not.toContain('border-[#182230]');
    expect(tabElements[1].classes()).toContain('border-[#182230]');
    expect(tabElements[1].classes()).toContain('text-[#182230]');
    expect(tabElements[2].classes()).not.toContain('border-[#182230]');
  });

  it('emits changeTab event with correct key on click', async () => {
    const wrapper = mount(TabsComponent, {
      props: { tabs }
    });
    const tabElements = wrapper.findAll('span');
    
    await tabElements[2].trigger('click');
    
    expect(wrapper.emitted('changeTab')).toBeTruthy();
    expect(wrapper.emitted('changeTab')[0]).toEqual(['tab3']);
  });

  it('maintains basic styling classes on all tabs', () => {
    const wrapper = mount(TabsComponent, {
      props: { tabs }
    });
    const firstTab = wrapper.find('span');
    
    expect(firstTab.classes()).toContain('cursor-pointer');
    expect(firstTab.classes()).toContain('text-[#667085]');
    expect(firstTab.classes()).toContain('p-3');
  });
});
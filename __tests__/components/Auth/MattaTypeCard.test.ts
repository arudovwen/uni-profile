import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MattaTypeCard from '@/components/Auth/MattaTypeCard.vue';

describe('MattaTypeCard.vue', () => {
  it('applies active classes when active prop is true', () => {
    const wrapper = mount(MattaTypeCard, {
      props: {
        active: true,
        title: 'Active Title',
        description: 'Active Desc'
      },
      global: {
        stubs: {
          AppIcon: true
        }
      }
    });

    expect(wrapper.classes()).toContain('border-[#80B0FF]');
    
    const titleElement = wrapper.findAll('div').find(n => n.text() === 'Active Title');
    const descElement = wrapper.findAll('div').find(n => n.text() === 'Active Desc');
    
    expect(titleElement.classes()).toContain('text-primary-500');
    expect(descElement.classes()).toContain('text-primary-500');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(MattaTypeCard, {
      props: {
        title: 'Click Me'
      },
      global: {
        stubs: { AppIcon: true }
      }
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('updates styles dynamically when active prop changes', async () => {
    const wrapper = mount(MattaTypeCard, {
      props: {
        active: false
      },
      global: {
        stubs: { AppIcon: true }
      }
    });

    expect(wrapper.classes()).not.toContain('border-[#80B0FF]');
    
    await wrapper.setProps({ active: true });
    expect(wrapper.classes()).toContain('border-[#80B0FF]');
  });
});
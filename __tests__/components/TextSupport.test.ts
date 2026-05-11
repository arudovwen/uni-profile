import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TextSupport from '@/components/TextSupport.vue';

describe('TextSupport.vue', () => {
  it('renders props and slot correctly', () => {
    const wrapper = mount(TextSupport, {
      props: {
        text: 'Main Title',
        subText: 'Secondary Detail'
      },
      slots: {
        default: '<div class="slot-content">Icon</div>'
      }
    });

    expect(wrapper.text()).toContain('Main Title');
    expect(wrapper.text()).toContain('Secondary Detail');
    expect(wrapper.find('.slot-content').exists()).toBe(true);
  });

  it('applies custom classes from props', () => {
    const wrapper = mount(TextSupport, {
      props: {
        text: 'Test',
        subText: 'Test',
        containerClass: 'custom-container',
        textClass: 'custom-text-class',
        subTextClass: 'custom-subtext-class'
      }
    });

    const rootSpan = wrapper.find('span');
    const spans = wrapper.findAll('span');
    const textSpan = spans[1];
    const subTextSpan = spans[2];

    expect(rootSpan.classes()).toContain('custom-container');
    expect(rootSpan.classes()).toContain('flex');
    expect(textSpan.classes()).toContain('custom-text-class');
    expect(textSpan.classes()).toContain('text-[#667085]');
    expect(subTextSpan.classes()).toContain('custom-subtext-class');
    expect(subTextSpan.classes()).toContain('font-semibold');
  });

  it('handles empty or missing props', () => {
    const wrapper = mount(TextSupport, {
      props: {}
    });

    const spans = wrapper.findAll('span');
    expect(spans[1].text()).toBe('');
    expect(spans[2].text()).toBe('');
    expect(wrapper.find('div.flex-col').exists()).toBe(true);
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CardSvg from '@/components/Svgs/cardSvg.vue';

describe('cardSvg.vue', () => {
  it('renders with default inactive colors', () => {
    const wrapper = mount(CardSvg, {
      props: {
        active: false
      }
    });

    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('#475467');
    });
  });

  it('renders with white stroke when active is true', () => {
    const wrapper = mount(CardSvg, {
      props: {
        active: true
      }
    });

    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('updates colors when active prop changes', async () => {
    const wrapper = mount(CardSvg, {
      props: {
        active: false
      }
    });

    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('renders the svg element with correct dimensions', () => {
    const wrapper = mount(CardSvg);
    const svg = wrapper.find('svg');
    
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
  });
});
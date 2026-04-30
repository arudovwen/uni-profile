import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import customersSvg from '@/components/Svgs/customersSvg.vue';

describe('customersSvg.vue', () => {
  it('renders with default inactive stroke color #475467', () => {
    const wrapper = mount(customersSvg, {
      props: {
        active: false
      }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('#475467');
    });
  });

  it('renders with white stroke color when active is true', () => {
    const wrapper = mount(customersSvg, {
      props: {
        active: true
      }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('reacts to prop changes', async () => {
    const wrapper = mount(customersSvg, {
      props: {
        active: false
      }
    });
    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('renders the svg with correct attributes', () => {
    const wrapper = mount(customersSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.attributes('fill')).toBe('none');
  });
});
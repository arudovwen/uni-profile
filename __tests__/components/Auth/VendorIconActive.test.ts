import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VendorIconActive from '@/components/Auth/VendorIconActive.vue';

describe('VendorIconActive.vue', () => {
  it('renders the svg with correct attributes', () => {
    const wrapper = mount(VendorIconActive);
    const svg = wrapper.find('svg');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('28');
    expect(svg.attributes('height')).toBe('29');
    expect(svg.attributes('viewBox')).toBe('0 0 28 29');
  });

  it('renders all path elements with correct fill color', () => {
    const wrapper = mount(VendorIconActive);
    const paths = wrapper.findAll('path');

    expect(paths.length).toBe(5);
    paths.forEach(path => {
      expect(path.attributes('fill')).toBe('#3481FF');
    });
  });

  it('verifies specific path opacities for coverage', () => {
    const wrapper = mount(VendorIconActive);
    const paths = wrapper.findAll('path');

    expect(paths[0].attributes('opacity')).toBe('0.4');
    expect(paths[2].attributes('opacity')).toBe('0.6');
    expect(paths[3].attributes('opacity')).toBe('0.6');
  });
});
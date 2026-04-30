import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VendorIcon from '@/components/Auth/VendorIcon.vue';

describe('VendorIcon.vue', () => {
  it('renders the svg correctly', () => {
    const wrapper = mount(VendorIcon);
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('28');
    expect(svg.attributes('height')).toBe('29');
    expect(svg.attributes('viewBox')).toBe('0 0 28 29');
  });

  it('contains five path elements', () => {
    const wrapper = mount(VendorIcon);
    const paths = wrapper.findAll('path');
    expect(paths.length).toBe(5);
  });

  it('renders paths with correct fill and opacity', () => {
    const wrapper = mount(VendorIcon);
    const paths = wrapper.findAll('path');

    expect(paths[0].attributes('opacity')).toBe('0.4');
    expect(paths[0].attributes('fill')).toBe('#98A2B3');

    expect(paths[1].attributes('fill')).toBe('#98A2B3');
    expect(paths[1].attributes('opacity')).toBeUndefined();

    expect(paths[2].attributes('opacity')).toBe('0.6');
    expect(paths[3].attributes('opacity')).toBe('0.6');
  });
});
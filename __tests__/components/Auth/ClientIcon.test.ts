import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ClientIcon from '@/components/Auth/ClientIcon.vue';

describe('ClientIcon.vue', () => {
  it('renders the svg with correct base attributes', () => {
    const wrapper = mount(ClientIcon);
    const svg = wrapper.find('svg');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('28');
    expect(svg.attributes('height')).toBe('29');
    expect(svg.attributes('viewBox')).toBe('0 0 28 29');
    expect(svg.attributes('fill')).toBe('#98A2B3');
  });

  it('renders three path elements', () => {
    const wrapper = mount(ClientIcon);
    const paths = wrapper.findAll('path');

    expect(paths.length).toBe(3);
  });

  it('renders the first path with specific attributes', () => {
    const wrapper = mount(ClientIcon);
    const firstPath = wrapper.findAll('path')[0];

    expect(firstPath.attributes('opacity')).toBe('0.4');
    expect(firstPath.attributes('stroke')).toBe('#475467');
  });
});
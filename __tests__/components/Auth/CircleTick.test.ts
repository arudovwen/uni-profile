import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CircleTick from '@/components/Auth/CircleTick.vue';

describe('CircleTick.vue', () => {
  it('renders the svg correctly', () => {
    const wrapper = mount(CircleTick);
    
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('96');
    expect(svg.attributes('height')).toBe('96');
    expect(svg.attributes('viewBox')).toBe('0 0 96 96');
    expect(svg.attributes('fill')).toBe('none');
  });

  it('contains both path elements with correct fill colors', () => {
    const wrapper = mount(CircleTick);
    const paths = wrapper.findAll('path');
    
    expect(paths.length).toBe(2);
    
    expect(paths[0].attributes('opacity')).toBe('0.4');
    expect(paths[0].attributes('fill')).toBe('#17B26A');
    
    expect(paths[1].attributes('fill')).toBe('#17B26A');
  });
});
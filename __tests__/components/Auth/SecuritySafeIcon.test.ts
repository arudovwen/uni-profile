import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SecuritySafeIcon from '@/components/Auth/SecuritySafeIcon.vue';

describe('SecuritySafeIcon.vue', () => {
  it('renders the svg and its paths correctly', () => {
    const wrapper = mount(SecuritySafeIcon);
    const svg = wrapper.find('svg');
    const paths = wrapper.findAll('path');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('96');
    expect(svg.attributes('height')).toBe('96');
    expect(svg.attributes('viewBox')).toBe('0 0 96 96');

    expect(paths.length).toBe(2);
    
    expect(paths[0].attributes('opacity')).toBe('0.4');
    expect(paths[0].attributes('fill')).toBe('#1570EF');
    
    expect(paths[1].attributes('fill')).toBe('#4E5BA6');
  });

  it('contains the correct svg namespace', () => {
    const wrapper = mount(SecuritySafeIcon);
    expect(wrapper.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });
});
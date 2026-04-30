import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ClientIconActive from '@/components/Auth/ClientIconActive.vue';

describe('ClientIconActive.vue', () => {
  it('renders the svg with correct base attributes', () => {
    const wrapper = mount(ClientIconActive);
    const svg = wrapper.find('svg');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('28');
    expect(svg.attributes('height')).toBe('29');
    expect(svg.attributes('viewBox')).toBe('0 0 28 29');
    expect(svg.attributes('fill')).toBe('#3381FF');
  });

  it('renders path elements with correct strokes based on active prop', async () => {
    const wrapper = mount(ClientIconActive, {
      props: { active: false }
    });
    
    const firstPath = wrapper.find('path');
    expect(firstPath.attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(firstPath.attributes('stroke')).toBe('white');
  });

  it('contains three path elements', () => {
    const wrapper = mount(ClientIconActive);
    const paths = wrapper.findAll('path');
    expect(paths.length).toBe(3);
  });

  it('verifies opacity on the first path', () => {
    const wrapper = mount(ClientIconActive);
    const firstPath = wrapper.find('path');
    expect(firstPath.attributes('opacity')).toBe('0.4');
  });
});
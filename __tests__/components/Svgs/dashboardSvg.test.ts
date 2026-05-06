import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import dashboardSvg from '@/components/Svgs/dashboardSvg.vue';

describe('dashboardSvg.vue', () => {
  it('renders with inactive stroke color by default', () => {
    const wrapper = mount(dashboardSvg, {
      props: { active: false }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('#475467');
    });
  });

  it('renders with white stroke color when active is true', () => {
    const wrapper = mount(dashboardSvg, {
      props: { active: true }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('updates stroke color when active prop changes', async () => {
    const wrapper = mount(dashboardSvg, {
      props: { active: false }
    });
    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');
    
    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('contains svg with correct base attributes', () => {
    const wrapper = mount(dashboardSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });
});
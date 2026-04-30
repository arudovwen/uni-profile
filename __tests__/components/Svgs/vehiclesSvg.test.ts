import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import vehiclesSvg from '@/components/Svgs/vehiclesSvg.vue';

describe('vehiclesSvg.vue', () => {
  it('renders with default inactive stroke color #475467', () => {
    const wrapper = mount(vehiclesSvg, {
      props: { active: false }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('#475467');
    });
  });

  it('renders with white stroke color when active is true', () => {
    const wrapper = mount(vehiclesSvg, {
      props: { active: true }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('reacts to prop changes', async () => {
    const wrapper = mount(vehiclesSvg, {
      props: { active: false }
    });
    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('renders svg with correct base attributes', () => {
    const wrapper = mount(vehiclesSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.attributes('fill')).toBe('none');
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import profileSvg from '@/components/Svgs/profileSvg.vue';

describe('profileSvg.vue', () => {
  it('renders with default inactive stroke color #475467', () => {
    const wrapper = mount(profileSvg, {
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
    const wrapper = mount(profileSvg, {
      props: {
        active: true
      }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('updates path colors when active prop changes', async () => {
    const wrapper = mount(profileSvg, {
      props: {
        active: false
      }
    });
    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('renders the svg with correct attributes and classes', () => {
    const wrapper = mount(profileSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.classes()).toContain('hover:text-primary-500');
  });
});
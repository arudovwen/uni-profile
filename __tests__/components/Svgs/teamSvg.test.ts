import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import teamSvg from '@/components/Svgs/teamSvg.vue';

describe('teamSvg.vue', () => {
  it('renders with default stroke color #475467', () => {
    const wrapper = mount(teamSvg, {
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
    const wrapper = mount(teamSvg, {
      props: {
        active: true
      }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('reacts to active prop changes', async () => {
    const wrapper = mount(teamSvg, {
      props: {
        active: false
      }
    });
    expect(wrapper.find('path').attributes('stroke')).toBe('#475467');

    await wrapper.setProps({ active: true });
    expect(wrapper.find('path').attributes('stroke')).toBe('white');
  });

  it('contains an svg with correct dimensions', () => {
    const wrapper = mount(teamSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
  });
});
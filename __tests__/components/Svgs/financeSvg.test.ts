import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import financeSvg from '@/components/Svgs/financeSvg.vue';

describe('financeSvg.vue', () => {
  it('renders with default inactive stroke color #475467', () => {
    const wrapper = mount(financeSvg, {
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
    const wrapper = mount(financeSvg, {
      props: {
        active: true
      }
    });
    const paths = wrapper.findAll('path');
    paths.forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });
  });

  it('reacts to prop changes for all path elements', async () => {
    const wrapper = mount(financeSvg, {
      props: {
        active: false
      }
    });
    
    await wrapper.setProps({ active: true });
    wrapper.findAll('path').forEach(path => {
      expect(path.attributes('stroke')).toBe('white');
    });

    await wrapper.setProps({ active: false });
    wrapper.findAll('path').forEach(path => {
      expect(path.attributes('stroke')).toBe('#475467');
    });
  });

  it('renders the svg with correct dimensions and viewbox', () => {
    const wrapper = mount(financeSvg);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('24');
    expect(svg.attributes('height')).toBe('24');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.attributes('fill')).toBe('none');
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import linkSvg from '@/components/Svgs/linkSvg.vue';

describe('linkSvg.vue', () => {
  it('renders correctly with all internal svg elements', () => {
    const wrapper = mount(linkSvg);
    
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('22');
    expect(svg.attributes('height')).toBe('22');
    expect(svg.attributes('viewBox')).toBe('0 0 22 22');

    const rects = wrapper.findAll('rect');
    expect(rects.length).toBe(3);
    expect(rects[0].attributes('fill')).toBe('#F9FAFB');
    expect(rects[1].attributes('stroke')).toBe('#E4E7EC');

    const path = wrapper.find('path');
    expect(path.exists()).toBe(true);
    expect(path.attributes('stroke')).toBe('#475467');
    expect(path.attributes('stroke-width')).toBe('1.5');

    const clipPath = wrapper.find('clipPath');
    expect(clipPath.exists()).toBe(true);
    expect(clipPath.attributes('id')).toBe('clip0_2620_26695');
  });
});
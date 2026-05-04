import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import GridSkeleton from '@/components/Skeleton/grid.vue';

describe('GridSkeleton.vue', () => {
  it('renders the default number of items', () => {
    const wrapper = mount(GridSkeleton);
    const items = wrapper.findAll('.rounded-md.bg-white');
    expect(items.length).toBe(6);
  });

  it('renders a specific number of items based on the count prop', () => {
    const count = 3;
    const wrapper = mount(GridSkeleton, {
      props: { count },
    });
    const items = wrapper.findAll('.rounded-md.bg-white');
    expect(items.length).toBe(count);
  });

  it('contains the animate-pulse effect', () => {
    const wrapper = mount(GridSkeleton);
    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('has the correct grid layout structure', () => {
    const wrapper = mount(GridSkeleton);
    expect(wrapper.element.classList).toContain('grid');
    expect(wrapper.element.classList).toContain('lg:grid-cols-3');
  });
});
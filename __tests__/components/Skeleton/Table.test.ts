import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TableSkeleton from '@/components/Skeleton/Table.vue';

describe('TableSkeleton.vue', () => {
  it('renders the default number of rows', () => {
    const wrapper = mount(TableSkeleton);
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(6);
  });

  it('renders a specific number of rows based on the count prop', () => {
    const count = 10;
    const wrapper = mount(TableSkeleton, {
      props: { count },
    });
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(count);
  });

  it('renders the correct table structure', () => {
    const wrapper = mount(TableSkeleton);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.findAll('thead th').length).toBe(5);
    expect(wrapper.findAll('tbody td').length).toBe(6 * 5);
  });

  it('applies the animate-pulse class for skeleton effect', () => {
    const wrapper = mount(TableSkeleton);
    expect(wrapper.find('table').classes()).toContain('animate-pulse');
  });
});
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SimplePagination from '@/components/Pagination/Simple.vue';

describe('SimplePagination.vue', () => {
  it('does not render when totalPages is 0', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 0 }
    });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders page information correctly', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 50, perPage: 10, current: 2 }
    });
    expect(wrapper.text()).toContain('Page 2 to 5');
  });

  it('emits page-changed and calls pageChanged function on button click', async () => {
    const pageChangedSpy = vi.fn();
    const wrapper = mount(SimplePagination, {
      props: {
        total: 30,
        perPage: 10,
        current: 2,
        pageChanged: pageChangedSpy
      }
    });

    const buttons = wrapper.findAll('button');
    
    await buttons[0].trigger('click');
    expect(wrapper.emitted('page-changed')[0]).toEqual([1]);
    expect(pageChangedSpy).toHaveBeenCalledWith({ currentPage: 1 });

    await buttons[1].trigger('click');
    expect(wrapper.emitted('page-changed')[1]).toEqual([3]);
    expect(pageChangedSpy).toHaveBeenCalledWith({ currentPage: 3 });
  });

  it('disables previous button on first page', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 30, current: 1 }
    });
    const prevBtn = wrapper.findAll('button')[0];
    expect(prevBtn.element.disabled).toBe(true);
    expect(prevBtn.classes()).toContain('opacity-50');
  });

  it('disables next button on last page', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 30, perPage: 10, current: 3 }
    });
    const nextBtn = wrapper.findAll('button')[1];
    expect(nextBtn.element.disabled).toBe(true);
    expect(nextBtn.classes()).toContain('opacity-50');
  });

  it('covers all helper methods and edge cases for range calculation', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 100, perPage: 10, current: 5, pageRange: 2 }
    });

    expect(wrapper.vm.rangeStart).toBe(3);
    expect(wrapper.vm.rangeEnd).toBe(7);
    expect(wrapper.vm.pages).toEqual([3, 4, 5, 6, 7]);
    expect(wrapper.vm.hasFirst()).toBe(true);
    expect(wrapper.vm.hasLast()).toBe(true);
    expect(wrapper.vm.hasNext()).toBe(true);
    expect(wrapper.vm.hasPrev()).toBe(true);

    const boundaryWrapper = mount(SimplePagination, {
      props: { total: 20, perPage: 10, current: 1, pageRange: 5 }
    });
    expect(boundaryWrapper.vm.rangeStart).toBe(1);
    expect(boundaryWrapper.vm.rangeEnd).toBe(2);
    expect(boundaryWrapper.vm.hasFirst()).toBe(false);
    expect(boundaryWrapper.vm.hasLast()).toBe(false);
  });

  it('calls perPageChanged when customPerPageChange is invoked', () => {
    const perPageSpy = vi.fn();
    const wrapper = mount(SimplePagination, {
      props: { perPageChanged: perPageSpy }
    });
    
    wrapper.vm.customPerPageChange(25);
    expect(perPageSpy).toHaveBeenCalledWith({ currentPerPage: 25 });
  });

  it('handles page change clicks outside of valid range for logic coverage', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 10, current: 1 }
    });
    wrapper.vm.changePage(0);
    expect(wrapper.emitted('page-changed')).toBeUndefined();
    
    wrapper.vm.changePage(5);
    expect(wrapper.emitted('page-changed')).toBeUndefined();
  });

  it('renders with custom wrapper class', () => {
    const wrapper = mount(SimplePagination, {
      props: { total: 10, wrapperClass: 'custom-class' }
    });
    expect(wrapper.find('.custom-class').exists()).toBe(true);
  });
});
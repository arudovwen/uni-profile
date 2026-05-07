import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/Pagination/index.vue';

describe('Pagination Component', () => {
  it('renders nothing when totalPages is 0', () => {
    const wrapper = mount(Pagination, {
      props: { total: 0, perPage: 10 }
    });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders correctly with default props', () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, current: 1 }
    });
    expect(wrapper.findAll('li').length).toBeGreaterThan(0);
    expect(wrapper.find('.active').text()).toBe('1');
  });

  it('emits page-changed and calls pageChanged prop when a page is clicked', async () => {
    const pageChangedSpy = vi.fn();
    const wrapper = mount(Pagination, {
      props: { 
        total: 50, 
        perPage: 10, 
        current: 1,
        pageChanged: pageChangedSpy 
      }
    });

    const page2Button = wrapper.findAll('button').find(b => b.text().includes('2'));
    await page2Button.trigger('click');

    expect(wrapper.emitted('page-changed')[0]).toEqual([2]);
    expect(pageChangedSpy).toHaveBeenCalledWith({ currentPage: 2 });
  });

  it('handles previous and next buttons correctly', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, perPage: 10, current: 2, enableText: true }
    });

    const buttons = wrapper.findAll('button');
    const prevBtn = buttons[0];
    const nextBtn = buttons[buttons.length - 1];

    expect(prevBtn.text()).toBe('Previous');
    expect(nextBtn.text()).toBe('Next');

    await prevBtn.trigger('click');
    expect(wrapper.emitted('page-changed')[0]).toEqual([1]);

    await nextBtn.trigger('click');
    expect(wrapper.emitted('page-changed')[1]).toEqual([3]);
  });

  it('disables previous button on first page and next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 20, perPage: 10, current: 1 }
    });
    
    const buttons = wrapper.findAll('button');
    expect(buttons[0].element.disabled).toBe(true);
    expect(buttons[0].classes()).toContain('cursor-not-allowed');

    const lastWrapper = mount(Pagination, {
      props: { total: 20, perPage: 10, current: 2 }
    });
    const lastButtons = lastWrapper.findAll('button');
    expect(lastButtons[lastButtons.length - 1].element.disabled).toBe(true);
  });

  it('shows first page and ellipsis when far from start', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10, current: 8, pageRange: 2 }
    });
    
    expect(wrapper.text()).toContain('1');
    expect(wrapper.findAll('li').at(2).text()).toBe('...');
    expect(wrapper.vm.hasFirst()).toBe(true);
  });

  it('shows last page and ellipsis when far from end', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, perPage: 10, current: 2, pageRange: 2 }
    });
    
    expect(wrapper.text()).toContain('10');
    const listItems = wrapper.findAll('li');
    const ellipsis = listItems.find(li => li.text() === '...');
    expect(ellipsis.exists()).toBe(true);
    expect(wrapper.vm.hasLast()).toBe(true);
  });

  it('calls perPageChanged through customPerPageChange', () => {
    const perPageSpy = vi.fn();
    const wrapper = mount(Pagination, {
      props: { perPageChanged: perPageSpy }
    });
    
    wrapper.vm.customPerPageChange(20);
    expect(perPageSpy).toHaveBeenCalledWith({ currentPerPage: 20 });
  });

  it('computes rangeStart and rangeEnd correctly at boundaries', () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, current: 1, pageRange: 2 }
    });
    expect(wrapper.vm.rangeStart).toBe(1);
    expect(wrapper.vm.rangeEnd).toBe(3);

    const endWrapper = mount(Pagination, {
      props: { total: 50, perPage: 10, current: 5, pageRange: 2 }
    });
    expect(endWrapper.vm.rangeStart).toBe(3);
    expect(endWrapper.vm.rangeEnd).toBe(5);
  });

  it('validates helper methods for internal logic coverage', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, perPage: 10, current: 2 }
    });
    expect(wrapper.vm.hasPrev()).toBe(true);
    expect(wrapper.vm.hasNext()).toBe(true);
    
    const firstWrapper = mount(Pagination, {
      props: { total: 30, perPage: 10, current: 1 }
    });
    expect(firstWrapper.vm.hasPrev()).toBe(false);
  });
});
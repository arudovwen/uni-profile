import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ScrollToTop from '~/components/AppScrollTop.vue';

describe('ScrollToTop', () => {
  it('should not render button when at top of the page', () => {
    const wrapper = mount(ScrollToTop);
    expect(wrapper.find('span').exists()).toBe(false);
  });

  it('should render button when not at top of the page', async () => {
    const wrapper = mount(ScrollToTop);
    
    // Simulate scrolling
    global.window.pageYOffset = 700;
    window.dispatchEvent(new Event('scroll'));
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('should scroll to top when button is clicked', async () => {
    const wrapper = mount(ScrollToTop);
    
    // Simulate scrolling
    global.window.pageYOffset = 700;
    window.dispatchEvent(new Event('scroll'));
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('span').exists()).toBe(true);
    
    // Spy on scrollTo
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    await wrapper.find('span').trigger('click');
    
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});

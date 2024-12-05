// AppFooter.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AppFooter from "~/components/AppFooter.vue";

// Mock necessary imports
vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'buy-chemicals'
  })
}));

describe('AppFooter.vue', () => {
  it('renders footer correctly', () => {
    const wrapper = mount(AppFooter);

    // Check if the footer contains the logo
    const logo = wrapper.find('img[alt="Matta"]');
    expect(logo.exists()).toBe(true);

    // // Check if the footer contains the extra content based on the route
    // const extraContent = wrapper.find('.flex-1');
    // expect(extraContent.exists()).toBe(true);
    // expect(extraContent.text()).toContain('Start selling with Matta');

    // Check if the footer contains social links
    const socialLinks = wrapper.findAll('a[target="_blank"]');
    expect(socialLinks.length).toBe(4);

    // Check if the footer contains navigation links
    const navLinks = wrapper.findAll('ul li');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  // it('navigates to the correct URL when button is clicked', async () => {
  //   const navigateTo = vi.fn();
  //   const wrapper = mount(AppFooter, {
  //     methods: { navigateTo },
  //   });

  //   const button = wrapper.get('[data-testid="get-started"]');
  //   await button.trigger('click');

  //   expect(navigateTo).toHaveBeenCalledWith('/auth/vendor-register');
  // });

  it('toggles the contact form popup when Contact is clicked', async () => {
    const wrapper = mount(AppFooter);

    const contactLink = wrapper.find('li span');
    await contactLink.trigger('click');

    expect(wrapper.vm.open).toBe(true);
  });
});

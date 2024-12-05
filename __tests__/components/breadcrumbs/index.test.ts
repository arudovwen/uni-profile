// Breadcrumbs.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Breadcrumbs from "~/components/Breadcrumbs/index.vue";

describe('Breadcrumbs.vue', () => {
  const links = [
    { title: 'home', url: '/' },
    { title: 'about', url: '/about' },
    { title: 'contact', url: '/contact' },
  ];

  it('renders breadcrumbs correctly', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { links },
    });

    // Check if all links are rendered
    const linkElements = wrapper.findAll('li');
    expect(linkElements.length).toBe(links.length);

    // Check if the titles are correct
    linkElements.forEach((linkElement, index) => {
      expect(linkElement.text()).toContain(links[index].title);
    });
  });


  it('applies custom className', () => {
    const className = 'custom-class';
    const wrapper = mount(Breadcrumbs, {
      props: { links, className },
    });

    // Check if custom className is applied
    const linkElement = wrapper.find('li');
    expect(linkElement.classes()).toContain(className);
  });
});

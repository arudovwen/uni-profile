import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppButton from '@/components/AppButton.vue';

describe('AppButton.vue', () => {
  const NuxtLinkStub = {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to']
  };

  const globalOptions = {
    stubs: {
      NuxtLink: NuxtLinkStub,
      AppIcon: { 
        name: 'AppIcon',
        template: '<i class="app-icon-stub" />' 
      }
    }
  };

  it('renders as a button by default', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      props: { text: 'Click me' }
    });
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Click me');
  });

  it('renders as NuxtLink when link prop is provided', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      props: { link: '/home', text: 'Go Home' }
    });
    expect(wrapper.find('a').exists()).toBe(true);
  });

  it('renders as a div when div prop is true', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      props: { div: true, text: 'I am a div' }
    });
    expect(wrapper.find('div.btn').exists()).toBe(true);
  });

  it('shows loading state and loading text across all types', async () => {
    const types = [
      { isLoading: true, loadingText: 'Wait...' },
      { isLoading: true, link: '/test', loadingText: 'Wait...' },
      { isLoading: true, div: true, loadingText: 'Wait...' }
    ];

    for (const props of types) {
      const wrapper = mount(AppButton, { global: globalOptions, props });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.text()).toContain('Wait...');
    }
  });

  it('applies disabled classes and attributes', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      props: { isDisabled: true }
    });
    const btn = wrapper.find('button');
    expect(btn.attributes('disabled')).toBeDefined();
    expect(btn.classes()).toContain('opacity-40');
  });

  it('renders default slot content', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      slots: { default: '<span class="slotted">Hi</span>' }
    });
    expect(wrapper.find('.slotted').exists()).toBe(true);
  });

  it('applies custom btnClass and loadingClass', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      props: { 
        btnClass: 'custom-style', 
        isLoading: true, 
        loadingClass: 'spinner-style' 
      }
    });
    
    const target = wrapper.find('.btn');
    expect(target.classes()).toContain('custom-style');
    expect(wrapper.find('svg').classes()).toContain('spinner-style');
  });

  it('passes attributes via v-bind', () => {
    const wrapper = mount(AppButton, {
      global: globalOptions,
      attrs: { id: 'btn-id', title: 'btn-title' }
    });
    const btn = wrapper.find('button');
    expect(btn.attributes('id')).toBe('btn-id');
    expect(btn.attributes('title')).toBe('btn-title');
  });
});
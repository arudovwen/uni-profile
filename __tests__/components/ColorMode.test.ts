import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ColorModeToggle from '~/components/ColorMode.vue';

describe('ColorModeToggle', () => {
  it('renders with correct initial label', () => {
    const wrapper = mount(ColorModeToggle, {
      global: {
        mocks: {
          $colorMode: {
            preference: 'light',
          },
        },
      },
    });
    expect(wrapper.text()).toContain('dark');
  });

  it('changes label after clicking the button', async () => {
    const wrapper = mount(ColorModeToggle, {
      global: {
        mocks: {
          $colorMode: {
            preference: 'light',
          },
        },
      },
    });

    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('dark');
  });

  it('toggles the color mode preference when clicked', async () => {
    const wrapper = mount(ColorModeToggle, {
      global: {
        mocks: {
          $colorMode: {
            preference: 'light',
          },
        },
      },
    });

    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$colorMode.preference).toBe('dark');

    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$colorMode.preference).toBe('light');
  });
});

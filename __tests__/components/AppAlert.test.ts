import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppAlert from '~/components/AppAlert.vue';

describe('AppAlert', () => {
  it('renders slot content', () => {
    const slotContent = 'Hello, Vitest!';
    const wrapper = mount(AppAlert, {
      slots: {
        default: slotContent
      }
    });

    expect(wrapper.html()).toContain(slotContent);
  });
});

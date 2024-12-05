import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppLine from '~/components/AppLine.vue';

describe('AppLine', () => {
  it('renders with the correct width based on the value prop', () => {
    const value = 50;
    const wrapper = mount(AppLine, {
      props: {
        value
      }
    });

    const span = wrapper.find('span');
    expect(span.attributes('style')).toContain(`width: ${value}%`);
  });
});

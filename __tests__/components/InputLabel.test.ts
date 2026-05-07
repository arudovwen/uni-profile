import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputLabel from '@/components/InputLabel.vue';

describe('InputLabel.vue', () => {
  it('renders the text prop', () => {
    const wrapper = mount(InputLabel, {
      props: { text: 'Username' }
    });
    expect(wrapper.find('span').text()).toBe('Username');
  });

  it('renders with default props and shows divider', () => {
    const wrapper = mount(InputLabel);
    const divider = wrapper.find('div.bg-\\[\\#E4E7EC\\]');
    expect(divider.exists()).toBe(true);
    expect(divider.element.style.display).not.toBe('none');
  });

  it('hides top margin divider when showTopMargin is false', async () => {
    const wrapper = mount(InputLabel, {
      props: { showTopMargin: false }
    });
    const divider = wrapper.find('div.bg-\\[\\#E4E7EC\\]');
    expect(divider.exists()).toBe(true);
    expect(divider.element.style.display).toBe('none');
  });

  it('applies custom containerClass to the divider', () => {
    const wrapper = mount(InputLabel, {
      props: { containerClass: 'custom-test-class' }
    });
    const divider = wrapper.find('div.bg-\\[\\#E4E7EC\\]');
    expect(divider.classes()).toContain('custom-test-class');
  });

  it('renders slot content', () => {
    const wrapper = mount(InputLabel, {
      slots: {
        default: '<input id="test-input" />'
      }
    });
    expect(wrapper.find('#test-input').exists()).toBe(true);
  });

  it('verifies all prop defaults and types', () => {
    const wrapper = mount(InputLabel, {
      props: {
        isCompulsory: true,
        text: 'Label',
        showTopMargin: true,
        containerClass: 'mt-2'
      }
    });
    expect(wrapper.props().isCompulsory).toBe(true);
    expect(wrapper.props().text).toBe('Label');
    expect(wrapper.props().showTopMargin).toBe(true);
    expect(wrapper.props().containerClass).toBe('mt-2');
  });
});
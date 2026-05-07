import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ButtonGroup from '@/components/ButtonGroup.vue';

describe('ButtonGroup.vue', () => {
  const content = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  it('renders all items provided in content prop', () => {
    const wrapper = mount(ButtonGroup, {
      props: { content }
    });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(content.length);
    expect(buttons[0].text()).toBe('Option 1');
    expect(buttons[1].text()).toBe('Option 2');
    expect(buttons[2].text()).toBe('Option 3');
  });

  it('applies active class to the correct item', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        content,
        active: 'opt2'
      }
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].classes()).toContain('bg-white');
    expect(buttons[1].classes()).toContain('bg-[#F9FAFB]');
    expect(buttons[2].classes()).toContain('bg-white');
  });

  it('emits onSelect event with correct value when clicked', async () => {
    const wrapper = mount(ButtonGroup, {
      props: { content }
    });
    const buttons = wrapper.findAll('button');
    
    await buttons[0].trigger('click');
    expect(wrapper.emitted('onSelect')).toBeTruthy();
    expect(wrapper.emitted('onSelect')[0]).toEqual(['opt1']);

    await buttons[2].trigger('click');
    expect(wrapper.emitted('onSelect')[1]).toEqual(['opt3']);
  });

  it('applies border-r to all but the last button', () => {
    const wrapper = mount(ButtonGroup, {
      props: { content }
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].classes()).toContain('border-r');
    expect(buttons[1].classes()).toContain('border-r');
    expect(buttons[2].classes()).toContain('last:border-none');
  });
});
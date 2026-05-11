import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import NameAndSign from '@/components/NameAndSign.vue';

describe('NameAndSign.vue', () => {
  it('renders the label prop correctly', () => {
    const labelText = 'Authorized Representative';
    const wrapper = mount(NameAndSign, {
      props: { label: labelText }
    });
    
    expect(wrapper.text()).toContain(labelText);
  });

  it('renders the static Signature / Date text', () => {
    const wrapper = mount(NameAndSign, {
      props: { label: 'Name' }
    });
    
    expect(wrapper.text()).toContain('Signature / Date');
  });

  it('contains the divider lines for both name and signature', () => {
    const wrapper = mount(NameAndSign, {
      props: { label: 'Name' }
    });
    
    const dividers = wrapper.findAll('div.h-\\[1px\\]');
    expect(dividers.length).toBe(2);
    expect(dividers[0].classes()).toContain('bg-[#475467]');
    expect(dividers[1].classes()).toContain('bg-[#475467]');
  });

  it('has the correct container layout classes', () => {
    const wrapper = mount(NameAndSign, {
      props: { label: 'Name' }
    });
    
    const container = wrapper.find('div.relative.w-full.flex.flex-row.justify-between');
    expect(container.exists()).toBe(true);
  });
});
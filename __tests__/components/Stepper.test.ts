import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import Stepper from '@/components/Stepper.vue';

describe('Stepper.vue', () => {
  const tabs = [
    { name: 'Step 1', subtext: 'Desc 1', value: 0 },
    { name: 'Step 2', subtext: 'Desc 2', value: 1 },
    { name: 'Step 3', subtext: 'Desc 3', value: 2 }
  ];

  const AppIcon = {
    name: 'AppIcon',
    template: '<div class="app-icon-stub" :data-icon="icon"></div>',
    props: ['icon', 'iconClass']
  };

  const createWrapper = (activeValue) => {
    return mount(Stepper, {
      props: { tabs },
      global: {
        stubs: { AppIcon },
        provide: {
          active: ref(activeValue)
        }
      }
    });
  };

  it('renders all tabs with correct text content', () => {
    const wrapper = createWrapper(0);
    expect(wrapper.text()).toContain('Step 1');
    expect(wrapper.text()).toContain('Step 3');
  });

  it('emits setActive when a tab is clicked', async () => {
    const wrapper = createWrapper(0);
    const tabElements = wrapper.findAll('.group');
    await tabElements[1].trigger('click');
    expect(wrapper.emitted('setActive')[0]).toEqual([1]);
  });

  it('applies primary-500 class to active and completed steps', () => {
    const wrapper = createWrapper(1);
    const textContainers = wrapper.findAll('.text-sm.leading-5');
    expect(textContainers[0].classes()).toContain('text-primary-500');
    expect(textContainers[1].classes()).toContain('text-primary-500');
    expect(textContainers[2].classes()).toContain('text-[#414651]');
  });

  it('applies border-primary-500 class to markers for active/completed tabs', () => {
    const wrapper = createWrapper(1);
    const markers = wrapper.findAll('.bg-white');
    expect(markers[0].classes()).toContain('before:border-primary-500');
    expect(markers[1].classes()).toContain('before:border-primary-500');
    expect(markers[2].classes()).toContain('before:border-[#EAECF0]');
  });

  it('handles default props and empty state', () => {
    const wrapper = mount(Stepper, {
      global: {
        stubs: { AppIcon },
        provide: { active: ref(0) }
      }
    });
    expect(wrapper.findAll('.group').length).toBe(0);
    expect(wrapper.props().complete).toBe(false);
    expect(wrapper.props().pending).toBe(false);
  });
});
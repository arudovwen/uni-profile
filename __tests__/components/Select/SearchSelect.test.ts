import { shallowMount } from '@vue/test-utils';
import SearchSelect from '@/components/Select/SearchSelect.vue';

describe('SearchSelect.vue', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ];

  it('applies conditional classes based on error, horizontal, and validate props', async () => {
    const wrapper = shallowMount(SearchSelect, {
      props: {
        error: 'Error message',
        horizontal: true,
        validate: 'valid'
      }
    });

    const container = wrapper.find('.formGroup');
    expect(container.classes()).toContain('has-error');
    expect(container.classes()).toContain('flex');
    expect(container.classes()).toContain('is-valid');
    
    const errorSpan = wrapper.find('span.text-sm');
    expect(errorSpan.text()).toBe('Error message');
  });

  it('toggles tooltip class on error span when msgTooltip is true', () => {
    const wrapper = shallowMount(SearchSelect, {
      props: {
        error: 'Error',
        msgTooltip: true
      }
    });
    expect(wrapper.find('.bg-danger-500').exists()).toBe(true);
  });

  it('opens dropdown on input focus and closes on option selection', async () => {
    const wrapper = shallowMount(SearchSelect, {
      props: { options }
    });

    const input = wrapper.find('input');
    await input.trigger('focus');
    expect(wrapper.vm.isOpen).toBe(true);
    
    const firstOption = wrapper.find('li');
    await firstOption.trigger('click');
    
    expect(wrapper.vm.selectedValue).toBe('1');
    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['1']);
  });

  it('syncs selectedValue when modelValue prop changes (Watcher)', async () => {
    const wrapper = shallowMount(SearchSelect, {
      props: { modelValue: 'initial' }
    });
    
    expect(wrapper.vm.selectedValue).toBe('initial');

    await wrapper.setProps({ modelValue: 'updated' });
    expect(wrapper.vm.selectedValue).toBe('updated');
  });

  it('emits update:modelValue when selectedValue changes internally', async () => {
    const wrapper = shallowMount(SearchSelect);
    wrapper.vm.selectedValue = 'new-value';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new-value']);
  });

  it('respects disabled and readonly attributes on input', () => {
    const wrapper = shallowMount(SearchSelect, {
      props: {
        disabled: true,
        isReadonly: true
      }
    });
    const input = wrapper.find('input');
    expect(input.element.disabled).toBe(true);
    expect(input.attributes('readonly')).toBeDefined();
  });
});
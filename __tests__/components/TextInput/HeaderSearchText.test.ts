import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeaderSearchText from '@/components/Textinput/HeaderSearchText.vue';

describe('HeaderSearchText.vue', () => {
  const defaultProps = {
    name: 'search-input',
    type: 'text'
  };

  const globalStubs = {
    global: {
      stubs: {
        Cleave: {
          template: '<input class="cleave-stub" />'
        },
        RedDot: {
          template: '<span id="red-dot-stub" />'
        },
        AppIcon: {
          template: '<div class="app-icon-stub" />'
        }
      }
    }
  };

  it('renders standard input by default and emits value', async () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, modelValue: 'test' },
      ...globalStubs
    });
    const input = wrapper.find('input:not(.cleave-stub)');
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('test');
    
    await input.setValue('new value');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value']);
  });

  it('renders cleave input when isMask is true', async () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, isMask: true, modelValue: '1234' },
      ...globalStubs
    });
    const cleave = wrapper.find('.cleave-stub');
    expect(cleave.exists()).toBe(true);
    
    await cleave.setValue('5678');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['5678']);
  });

  it('toggles password visibility when hasicon is true', async () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, type: 'password', hasicon: true },
      ...globalStubs
    });
    const toggleBtn = wrapper.find('span[iconClass="cursor-pointer text-secondary-500"]');
    expect(wrapper.vm.types).toBe('password');
    
    await toggleBtn.trigger('click');
    expect(wrapper.vm.types).toBe('text');
    
    await toggleBtn.trigger('click');
    expect(wrapper.vm.types).toBe('password');
  });

  it('applies error and validation classes and messages', () => {
    const wrapper = mount(HeaderSearchText, {
      props: { 
        ...defaultProps, 
        error: 'Error Msg', 
        validate: 'Valid Msg',
        horizontal: true 
      },
      ...globalStubs
    });
    expect(wrapper.find('.formGroup').classes()).toContain('has-error');
    expect(wrapper.find('.formGroup').classes()).toContain('is-valid');
    
    const messages = wrapper.findAll('span').filter(w => w.text() !== '');
    expect(messages.some(w => w.text() === 'Error Msg')).toBe(true);
    expect(messages.some(w => w.text() === 'Valid Msg')).toBe(true);
  });

  it('renders tooltips for error and validation when msgTooltip is true', () => {
    const wrapper = mount(HeaderSearchText, {
      props: { 
        ...defaultProps, 
        error: 'Err', 
        validate: 'Val', 
        msgTooltip: true 
      },
      ...globalStubs
    });
    expect(wrapper.find('.bg-danger-500').exists()).toBe(true);
    expect(wrapper.find('.bg-success-500').exists()).toBe(true);
  });

  it('handles iconPosition and hasicon styling', () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, iconPosition: 'left', hasicon: true },
      ...globalStubs
    });
    expect(wrapper.find('input').classes()).toContain('!pl-10');
    expect(wrapper.find('.absolute').classes()).toContain('left-[14px]');
  });

  it('renders description and slots', () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, description: 'Enter your name' },
      slots: {
        suffix: '<span class="suffix-slot">USD</span>',
        content: '<div class="content-slot">Extra</div>'
      },
      ...globalStubs
    });
    expect(wrapper.find('.suffix-slot').exists()).toBe(true);
    expect(wrapper.find('.content-slot').exists()).toBe(true);
    expect(wrapper.find('.text-xs').text()).toBe('Enter your name');
  });

  it('checks disabled and readonly attributes', () => {
    const wrapper = mount(HeaderSearchText, {
      props: { ...defaultProps, disabled: true, isReadonly: true },
      ...globalStubs
    });
    const input = wrapper.find('input');
    expect(input.element.disabled).toBe(true);
    expect(input.attributes('readonly')).toBeDefined();
  });
});
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TextInput from '@/components/Textinput/index.vue'

describe('TextInput.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(TextInput, {
      props: { name: 'test-input' }
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: '', name: 'test' }
    })
    const input = wrapper.find('input')
    await input.setValue('hello')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['hello'])
  })

  it('renders cleave component when isMask is true', () => {
    const wrapper = mount(TextInput, {
      props: { isMask: true, name: 'masked' },
      global: { stubs: { cleave: true } }
    })
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('cleave-stub').exists()).toBe(true)
  })

  it('toggles password visibility when hasicon is clicked', async () => {
    const wrapper = mount(TextInput, {
      props: { type: 'password', hasicon: true, name: 'pass' }
    })
    const toggleBtn = wrapper.find('span.mr-2')
    const input = wrapper.find('input')
    
    expect(input.attributes('type')).toBe('password')
    await toggleBtn.trigger('click')
    expect(input.attributes('type')).toBe('text')
    await toggleBtn.trigger('click')
    expect(input.attributes('type')).toBe('password')
  })

  it('handles error and validate states with tooltips', () => {
    const wrapper = mount(TextInput, {
      props: {
        error: 'Error message',
        validate: 'Valid message',
        msgTooltip: true,
        horizontal: true,
        containerClass: 'custom-container'
      }
    })
    const errorSpan = wrapper.find('.bg-danger-500')
    const validSpan = wrapper.find('.bg-success-500')
    
    expect(errorSpan.exists()).toBe(true)
    expect(validSpan.exists()).toBe(true)
    expect(wrapper.find('.formGroup').classes()).toContain('has-error')
    expect(wrapper.find('.formGroup').classes()).toContain('flex')
    expect(wrapper.find('.formGroup').classes()).toContain('custom-container')
  })

  it('renders description and slots', () => {
    const wrapper = mount(TextInput, {
      props: { description: 'Help text' },
      slots: {
        suffix: '<span class="suffix-slot">End</span>',
        content: '<div class="content-slot">Inside</div>'
      }
    })
    expect(wrapper.text()).toContain('Help text')
    expect(wrapper.find('.suffix-slot').exists()).toBe(true)
    expect(wrapper.find('.content-slot').exists()).toBe(true)
  })
})
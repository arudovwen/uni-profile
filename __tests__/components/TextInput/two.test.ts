import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import TextInputTwo from '@/components/Textinput/two.vue'

const mockHandleChange = vi.fn()
const mockHandleBlur = vi.fn()

vi.mock('vee-validate', () => ({
  useField: vi.fn(() => ({
    errorMessage: ref(''),
    value: ref(''),
    handleChange: mockHandleChange,
    handleBlur: mockHandleBlur
  }))
}))

const RedDot = { template: '<div id="red-dot"></div>' }
const AppIcon = { props: ['icon'], template: '<div class="app-icon">{{icon}}</div>' }
const EmailIcon = { template: '<div></div>' }
const PhoneIncoming = { template: '<div></div>' }
const LocationIcon = { template: '<div></div>' }
const PasswordIcon = { template: '<div></div>' }

const globalConfig = {
  stubs: {
    RedDot,
    AppIcon,
    EmailIcon,
    PhoneIncoming,
    LocationIcon,
    PasswordIcon,
    cleave: {
      template: '<input class="cleave-stub" @input="$emit(\'input\', $event)" />'
    }
  }
}


describe('TextInputTwo.vue', () => {
  it('triggers validation listeners on input and blur', async () => {
    const wrapper = mount(TextInputTwo, {
      props: { name: 'testField' },
      global: globalConfig
    })

    const input = wrapper.find('input')

    await input.trigger('input')
    expect(mockHandleChange).toHaveBeenCalled()

    await input.trigger('blur')
    expect(mockHandleBlur).toHaveBeenCalled()

    await input.trigger('change')
    expect(mockHandleChange).toHaveBeenCalledTimes(2)
  })

  it('handles mask mode and cleave input', async () => {
    const wrapper = mount(TextInputTwo, {
      props: { isMask: true, name: 'masked' },
      global: globalConfig
    })

    const cleave = wrapper.find('.cleave-stub')
    await cleave.trigger('input')

    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('toggles password type visibility', async () => {
    const wrapper = mount(TextInputTwo, {
      props: { type: 'password', hasicon: true, name: 'pwd' },
      global: globalConfig
    })

    const input = wrapper.find('input')
    const toggle = wrapper.find('.mr-2')

    expect(input.attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(input.attributes('type')).toBe('text')

    await toggle.trigger('click')
    expect(input.attributes('type')).toBe('password')
  })

  it('renders all icon types and positions', () => {
    const iconTypes = ['email', 'phone', 'location', 'password', 'money']

    iconTypes.forEach(type => {
      const wrapper = mount(TextInputTwo, {
        props: {
          iconType: type,
          iconPosition: 'left',
          name: 'test',
          validate: 'Success'
        },
        global: globalConfig
      })

      expect(wrapper.find('.left-\\[14px\\]').exists()).toBe(true)

      if (type === 'money') {
        expect(wrapper.text()).toContain('$')
      }
    })
  })

  it('displays error messages and validation with tooltips', async () => {
    const { useField } = await import('vee-validate')

    useField.mockReturnValue({
      errorMessage: ref('Required field'),
      value: ref(''),
      handleChange: vi.fn(),
      handleBlur: vi.fn()
    })

    const wrapper = mount(TextInputTwo, {
      props: {
        name: 'test',
        msgTooltip: true,
        validate: 'Looks good',
        description: 'Hint text'
      },
      global: globalConfig
    })

    expect(wrapper.find('.bg-danger-500').text()).toBe('Required field')
    expect(wrapper.find('.bg-success-500').text()).toBe('Looks good')
    expect(wrapper.text()).toContain('Hint text')
  })

  it('renders slots correctly', () => {
    const wrapper = mount(TextInputTwo, {
      props: { name: 'test' },
      slots: {
        suffix: '<span class="suffix-slot">End</span>',
        content: '<div class="content-slot">Extra</div>'
      },
      global: globalConfig
    })

    expect(wrapper.find('.suffix-slot').exists()).toBe(true)
    expect(wrapper.find('.content-slot').exists()).toBe(true)
  })
})
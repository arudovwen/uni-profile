import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PhoneNumber from '@/components/PhoneNumber.vue';

vi.mock('~/utils/countrycodes.js', () => ({
  default: [
    { label: 'Nigeria', phone: '234', code: 'NG', min: 10, max: 11 },
    { label: 'United States', phone: '1', code: 'US', min: 10, max: 10 }
  ]
}));

describe('PhoneNumber.vue', () => {
  it('renders labels and optional tags correctly', () => {
    const wrapper = mount(PhoneNumber, {
      props: {
        label: 'Phone',
        isOptional: true,
        isRequired: true,
        info: true,
        infoTitle: 'Info text'
      },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    expect(wrapper.text()).toContain('Phone');
    expect(wrapper.text()).toContain('(Optional)');
    expect(wrapper.findComponent({ name: 'RedDot' }).exists()).toBe(true);
    expect(wrapper.find('[title="Info text"]').exists()).toBe(true);
  });

  it('initializes with modelValue correctly', () => {
    const wrapper = mount(PhoneNumber, {
      props: { modelValue: '+1-5551234567' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    expect(wrapper.vm.phoneData.number).toBe('5551234567');
    expect(wrapper.vm.selectedCountry.phone).toBe('+1');
  });

  it('updates modelValue on input and enforces max length', async () => {
    const wrapper = mount(PhoneNumber, {
      props: { modelValue: '+1-' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    const input = wrapper.find('input[type="tel"]');
    await input.setValue('1234567890123');
    expect(wrapper.vm.phoneData.number).toBe('1234567890');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['+1-1234567890']);
  });

  it('validates required status', () => {
    const wrapper = mount(PhoneNumber, {
      props: { isRequired: true, modelValue: '', label: 'Phone' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    expect(wrapper.vm.phoneError).toBe('Phone number is required');
    expect(wrapper.find('.text-danger-500').text()).toBe('Phone number is required');
  });

  it('validates minimum and maximum lengths', async () => {
    const wrapper = mount(PhoneNumber, {
      props: { modelValue: '+234-123' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    expect(wrapper.vm.phoneError).toBe('Minimum length is 10');
    
    await wrapper.setProps({ modelValue: '+234-123456789012' });
    expect(wrapper.vm.phoneError).toBe('Maximum length is 11');
  });

  it('filters country list based on query', () => {
    const wrapper = mount(PhoneNumber, {
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    wrapper.vm.query = 'Nigeria';
    expect(wrapper.vm.filteredCountryList.length).toBe(1);
    
    wrapper.vm.query = '';
    expect(wrapper.vm.filteredCountryList.length).toBe(2);
  });

  it('handles horizontal layout and custom classes', () => {
    const wrapper = mount(PhoneNumber, {
      props: { horizontal: true, classLabel: 'custom-label', label: 'Phone' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    const label = wrapper.find('label');
    expect(label.classes()).toContain('flex-0');
    expect(label.classes()).toContain('custom-label');
  });

  it('syncs internal state when external modelValue changes', async () => {
    const wrapper = mount(PhoneNumber, {
      props: { modelValue: '+234-1' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    await wrapper.setProps({ modelValue: '+1-999' });
    expect(wrapper.vm.selectedCountry.phone).toBe('+1');
    expect(wrapper.vm.phoneData.number).toBe('999');
  });

  it('emits setError and updates via input', async () => {
    const wrapper = mount(PhoneNumber, {
      props: { isRequired: true, modelValue: '' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    const input = wrapper.find('input');
    await input.setValue('1');
    expect(wrapper.emitted('setError')).toBeTruthy();
  });

  it('displays icons and slots correctly', () => {
    const wrapper = mount(PhoneNumber, {
      props: { icon: 'user-icon', iconType: 'something' },
      slots: { suffix: '<span class="suffix-slot">End</span>' },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    expect(wrapper.findComponent({ name: 'AppIcon', props: { icon: 'user-icon' } }).exists()).toBe(true);
    expect(wrapper.find('.suffix-slot').exists()).toBe(true);
  });

  it('handles readonly and disabled states', () => {
    const wrapper = mount(PhoneNumber, {
      props: { isReadonly: true, disabled: true },
      global: { stubs: { AppIcon: true, RedDot: true, Combobox: true, Float: true, ComboboxInput: true, ComboboxButton: true, ComboboxOptions: true, ComboboxOption: true } }
    });
    const input = wrapper.find('input');
    expect(input.element.readOnly).toBe(true);
    expect(input.element.disabled).toBe(true);
  });
});
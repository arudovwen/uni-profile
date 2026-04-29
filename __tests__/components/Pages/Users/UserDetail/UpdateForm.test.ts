import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import UpdateForm from '@/components/Pages/Users/UserDetail/UpdateForm.vue';

describe('UpdateForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(UpdateForm, {
      props,
      global: {
        stubs: {
          FormGroup: true,
          SelectVueSelect: true,
          AppButton: {
            props: ['isLoading', 'isDisabled', 'text', 'type'],
            template: '<button :type="type" :disabled="isDisabled" @click="$emit(\'click\')">{{text}}</button>'
          }
        }
      }
    });
  };

  it('renders initial state correctly', () => {
    wrapper = createWrapper({ detail: { id: 1 } });
    expect(wrapper.find('h4').text()).toBe('Update User Role');
    expect(wrapper.vm.role).toBe('superadmin');
  });

  it('emits close when cancel button is clicked', async () => {
    wrapper = createWrapper();
    const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel');
    await cancelButton.trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('handles form submission', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    wrapper = createWrapper();
    
    await wrapper.find('form').trigger('submit.prevent');
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('onSubmit ~ values:'),
      expect.objectContaining({ role: 'superadmin' })
    );
    consoleSpy.mockRestore();
  });

  it('validates role field', async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue('role', '');
    
    await wrapper.find('form').trigger('submit.prevent');
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(wrapper.vm.errors.role).toBe('Role is required');
  });

  it('updates role value through model', async () => {
    wrapper = createWrapper();
    wrapper.vm.role = 'admin';
    await nextTick();
    expect(wrapper.vm.values.role).toBe('admin');
  });

  it('defines the roles options correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.vm.roles).toEqual([
      { label: "Superadmin", value: "superadmin" },
      { label: "Admin", value: "admin" }
    ]);
  });
});
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DepartmentDropdown from '@/components/forms/DepartmentDropdown.vue';
import { getDepartments, deleteDepartment } from "~/services/userservices";

vi.mock('~/services/userservices', () => ({
  getDepartments: vi.fn(),
  deleteDepartment: vi.fn()
}));

global.toast = {
  success: vi.fn(),
  error: vi.fn()
};

describe('DepartmentDropdown.vue', () => {
  const mockDepartments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' }
  ];

  const mountOptions = {
    global: {
      stubs: {
        transition: false,
        Listbox: { template: '<div><slot /></div>' },
        ListboxButton: { template: '<button class="lb-btn"><slot /></button>' },
        ListboxOptions: { template: '<div><slot /></div>' },
        ListboxOption: { template: '<div><slot :active="false" :selected="false" /></div>' },
        ChevronDownIcon: true,
        CheckIcon: true,
        RedDot: true,
        PagesModalsCreateDept: {
            name: 'PagesModalsCreateDept',
            template: '<div class="mock-modal"></div>',
            props: ['isOpen', 'detail']
        },
        DeleteModal: {
          props: ['open'],
          template: '<div v-if="open"><button id="confirm-delete" @click="$emit(\'deleteItem\')"></button></div>'
        }
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getDepartments.mockResolvedValue({ data: { data: mockDepartments } });
  });

  it('fetches departments on mount and matches modelValue', async () => {
    const wrapper = mount(DepartmentDropdown, {
      ...mountOptions,
      props: { modelValue: 'Engineering' }
    });
    await flushPromises();
    expect(getDepartments).toHaveBeenCalled();
    expect(wrapper.vm.selectedOption).toEqual(mockDepartments[0]);
  });

  it('renders labels and optional/required indicators', () => {
    const wrapper = mount(DepartmentDropdown, {
      ...mountOptions,
      props: { label: 'Dept', isRequired: true, isOptional: true }
    });
    expect(wrapper.text()).toContain('Dept');
    expect(wrapper.text()).toContain('(Optional)');
  });

  it('handles search input with debounce', async () => {
    vi.useFakeTimers();
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    const input = wrapper.find('input');
    await input.setValue('Eng');
    vi.advanceTimersByTime(500);
    expect(getDepartments).toHaveBeenLastCalledWith(expect.objectContaining({ Search: 'Eng' }));
    vi.useRealTimers();
  });

  it('updates selectedOption when prop modelValue changes', async () => {
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    wrapper.vm.options = mockDepartments;
    await wrapper.setProps({ modelValue: 'Marketing' });
    expect(wrapper.vm.selectedOption.name).toBe('Marketing');
  });

  it('handles successful deletion', async () => {
    deleteDepartment.mockResolvedValue({ status: 200 });
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    wrapper.vm.selectedOption = mockDepartments[0];
    wrapper.vm.deleteOpen = true;
    await wrapper.vm.$nextTick();

    await wrapper.find('#confirm-delete').trigger('click');
    await flushPromises();
    
    expect(deleteDepartment).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith('Department deleted successfully');
    expect(wrapper.vm.deleteOpen).toBe(false);
  });

  it('handles deletion error', async () => {
    const errorMsg = 'Failed to delete';
    deleteDepartment.mockRejectedValue({ response: { data: { Message: errorMsg } } });
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    wrapper.vm.selectedOption = mockDepartments[0];
    wrapper.vm.deleteOpen = true;
    await wrapper.vm.$nextTick();

    await wrapper.find('#confirm-delete').trigger('click');
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith(errorMsg);
  });

  it('shows searching state', async () => {
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Searching...');
  });

  it('shows empty result and "Add department" button', async () => {
    getDepartments.mockResolvedValue({ data: { data: [] } });
    const wrapper = mount(DepartmentDropdown, { ...mountOptions });
    await flushPromises();
    
    expect(wrapper.text()).toContain('Not found');
    const addBtn = wrapper.findAll('span').find(s => s.text().includes('Add department'));
    await addBtn.trigger('click');
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('displays error message when prop is provided', () => {
    const wrapper = mount(DepartmentDropdown, {
      ...mountOptions,
      props: { error: 'Selection required' }
    });
    expect(wrapper.find('.text-danger-500').text()).toBe('Selection required');
  });
});
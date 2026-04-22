import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FileUpload from '@/components/forms/FileUpload.vue';

describe('FileUpload.vue', () => {
  it('renders the initial state correctly', () => {
    const wrapper = mount(FileUpload);
    expect(wrapper.find('span.bg-\\[\\#98A2B3\\]').text()).toBe('Choose file');
    expect(wrapper.find('span.text-loft-black').exists()).toBe(false);
  });

  it('handles file selection and updates the UI', async () => {
    const wrapper = mount(FileUpload);
    const input = wrapper.find('input[type="file"]');
    const mockFile = new File(['content'], 'test-image.png', { type: 'image/png' });

    Object.defineProperty(input.element, 'files', {
      value: [mockFile],
      writable: false
    });

    await input.trigger('change');

    const fileNameSpan = wrapper.find('span.text-loft-black');
    expect(fileNameSpan.exists()).toBe(true);
    expect(fileNameSpan.text()).toBe('test-image.png');
    expect(wrapper.vm.file).toEqual(mockFile);
  });

  it('has a hidden file input linked to the label', () => {
    const wrapper = mount(FileUpload);
    const input = wrapper.find('input#uploadId');
    expect(input.attributes('class')).toContain('hidden');
    expect(wrapper.find('label').attributes('for')).toBeUndefined();
  });
});
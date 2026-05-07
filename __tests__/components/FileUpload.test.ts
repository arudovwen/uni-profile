import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileUpload from '@/components/FileUpload.vue';
import { toast } from 'vue3-toastify';
import * as onboardingService from '~/services/onboardingservice';

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('~/services/onboardingservice', () => ({
  uploaddocument: vi.fn(),
}));

describe('FileUpload.vue', () => {
  let wrapper;
  const mockHandleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(FileUpload, {
      props: {
        label: 'Upload Doc',
        id: 'test-id',
        isRequired: true,
        modelValue: '',
      },
      global: {
        provide: {
          handleChange: mockHandleChange,
        },
        stubs: {
          Icon: true,
          RedDot: true,
        },
      },
    });
  });

  it('renders label and required dot', () => {
    expect(wrapper.find('label').text()).toContain('Upload Doc');
    expect(wrapper.findComponent({ name: 'RedDot' }).exists()).toBe(true);
  });

  it('triggers file input click on button click', async () => {
    const input = wrapper.find('input[type="file"]').element;
    const spy = vi.spyOn(input, 'click');
    await wrapper.find('button').trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('handles single file upload successfully', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const mockResponse = { data: { data: 'https://cdn.com/test.pdf' } };
    onboardingService.uploaddocument.mockResolvedValue(res => res); 
    onboardingService.uploaddocument.mockResolvedValue(mockResponse);

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    
    await input.trigger('change');

    await vi.waitFor(() => {
      expect(onboardingService.uploaddocument).toHaveBeenCalled();
      expect(mockHandleChange).toHaveBeenCalledWith('test-id', 'https://cdn.com/test.pdf');
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['https://cdn.com/test.pdf']);
    });
  });

  it('validates invalid file extension', async () => {
    const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });

    await input.trigger('change');

    expect(toast.error).toHaveBeenCalledWith('Invalid file type. Please upload a document.');
    expect(onboardingService.uploaddocument).not.toHaveBeenCalled();
  });

  it('handles multiple file upload successfully', async () => {
    await wrapper.setProps({ multiple: true });
    const file1 = new File(['1'], 'a.jpg', { type: 'image/jpeg' });
    const file2 = new File(['2'], 'b.png', { type: 'image/png' });
    
    onboardingService.uploaddocument
      .mockResolvedValueOnce({ data: { data: 'url1' } })
      .mockResolvedValueOnce({ data: { data: 'url2' } });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file1, file2] });

    await input.trigger('change');

    await vi.waitFor(() => {
      expect(onboardingService.uploaddocument).toHaveBeenCalledTimes(2);
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([['url1', 'url2']]);
    });
  });

  it('handles single upload failure', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    onboardingService.uploaddocument.mockRejectedValue(new Error('Fail'));

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });

    await input.trigger('change');

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload failed. Please try again.');
    });
  });

  it('handles multiple upload partial failure', async () => {
    await wrapper.setProps({ multiple: true });
    const file = new File(['1'], 'a.jpg', { type: 'image/jpeg' });
    onboardingService.uploaddocument.mockRejectedValue(new Error('Fail'));

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });

    await input.trigger('change');

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Some files failed to upload. Please try again.');
    });
  });

  it('updates title when modelValue changes', async () => {
    await wrapper.setProps({ modelValue: 'new-title' });
    expect(wrapper.find('.truncate').text()).toBe('new-title');
  });

  it('returns early if no files selected in handleEvent', async () => {
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [] });
    await input.trigger('change');
    expect(onboardingService.uploaddocument).not.toHaveBeenCalled();
  });

  it('returns early if no files selected in handleMultiple', async () => {
    await wrapper.setProps({ multiple: true });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [] });
    await input.trigger('change');
    expect(onboardingService.uploaddocument).not.toHaveBeenCalled();
  });

  it('renders image preview when modelValue is present', async () => {
    await wrapper.setProps({ modelValue: 'image-url.png' });
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('image-url.png');
  });
});
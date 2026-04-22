import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileUploader from '@/components/forms/FileUploader.vue';
import { uploaddocument } from "@/services/onboardingservice.js";
import { toast } from "vue3-toastify";

vi.mock("@/services/onboardingservice.js", () => ({
  uploaddocument: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

describe('FileUploader.vue', () => {
  let handleChangeMock;

  beforeEach(() => {
    vi.clearAllMocks();
    handleChangeMock = vi.fn();
    
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function() {
      this.onload({ target: { result: 'data:image/png;base64,mockbase64' } });
    });
  });

  const mountOptions = (props = {}) => ({
    props,
    global: {
      provide: { handleChange: handleChangeMock },
      stubs: { Icon: true, RedDot: true }
    }
  });

  const createMockFile = (name) => {
    const file = new File(['content'], name, { type: 'image/png' });
    return file;
  };

  it('renders correctly with props', async () => {
    const wrapper = mount(FileUploader, mountOptions({
      label: 'Upload Label',
      modelValue: 'initial.png'
    }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('label').text()).toContain('Upload Label');
    expect(wrapper.find('span.flex-1').text()).toBe('initial.png');
  });

  it('triggers file input click when button is clicked', async () => {
    const wrapper = mount(FileUploader, mountOptions());
    const inputClickSpy = vi.spyOn(wrapper.vm.fileInputRef, 'click');
    await wrapper.find('button').trigger('click');
    expect(inputClickSpy).toHaveBeenCalled();
  });

  it('handles single file upload successfully', async () => {
    const mockResponse = { data: { message: 'http://link.com/file.png' } };
    uploaddocument.mockResolvedValue(mockResponse);

    const wrapper = mount(FileUploader, mountOptions({ id: 'file-1' }));
    const file = createMockFile('test.png');
    
    await wrapper.vm.handleEvent({ target: { files: [file] } });
    await flushPromises();

    expect(uploaddocument).toHaveBeenCalled();
    expect(handleChangeMock).toHaveBeenCalledWith('file-1', mockResponse.data.message);
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([mockResponse.data.message]);
  });

  it('rejects invalid file types for single upload', async () => {
    const wrapper = mount(FileUploader, mountOptions({ accept: 'pdf' }));
    const file = createMockFile('test.png');
    
    await wrapper.vm.handleEvent({ target: { files: [file] } });
    expect(toast.error).toHaveBeenCalledWith("Invalid file type. Please upload a document.");
  });

  it('handles multiple file upload successfully', async () => {
    uploaddocument
      .mockResolvedValueOnce({ data: { message: 'url1.png' } })
      .mockResolvedValueOnce({ data: { message: 'url2.png' } });

    const wrapper = mount(FileUploader, mountOptions({ id: 'multi-1', multiple: true }));
    const file1 = createMockFile('f1.png');
    const file2 = createMockFile('f2.png');
    
    const event = { target: { files: [file1, file2] } };

    await wrapper.vm.handleMultiple(event);
    await flushPromises();

    expect(uploaddocument).toHaveBeenCalledTimes(2);
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['url1.png', 'url2.png']]);
  });

  it('handles upload failure in single mode', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    uploaddocument.mockRejectedValue(new Error('Upload Failed'));

    const wrapper = mount(FileUploader, mountOptions());
    const file = createMockFile('test.png');
    
    await wrapper.vm.handleEvent({ target: { files: [file] } });
    await flushPromises();

    expect(wrapper.vm.loading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('returns early if no file is selected', async () => {
    const wrapper = mount(FileUploader, mountOptions());
    await wrapper.vm.handleEvent({ target: { files: [] } });
    expect(uploaddocument).not.toHaveBeenCalled();

    await wrapper.vm.handleMultiple({ target: { files: [] } });
    expect(uploaddocument).not.toHaveBeenCalled();
  });

  it('updates title when modelValue changes', async () => {
    const wrapper = mount(FileUploader, mountOptions({ modelValue: 'old.png' }));
    expect(wrapper.vm.title).toBe('old.png');

    await wrapper.setProps({ modelValue: 'new.png' });
    expect(wrapper.vm.title).toBe('new.png');
  });

  it('shows loader when loading is true', async () => {
    const wrapper = mount(FileUploader, mountOptions());
    wrapper.vm.loading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.loader').exists()).toBe(true);
  });
});
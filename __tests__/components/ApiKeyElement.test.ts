import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiKeyElement from '@/components/ApiKeyElement.vue';
import { toast } from "vue3-toastify";

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('ApiKeyElement.vue', () => {
  const writeTextMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    writeTextMock.mockResolvedValue(undefined);
    
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true
    });
  });

  it('renders props correctly', () => {
    const wrapper = mount(ApiKeyElement, {
      props: {
        label: 'Secret Key',
        value: 'sk_test_123',
        loading: false
      }
    });

    expect(wrapper.text()).toContain('Secret Key');
    const input = wrapper.find('input');
    expect(input.element.value).toBe('sk_test_123');
  });

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(ApiKeyElement, {
      props: {
        label: 'Secret Key',
        value: 'sk_test_123',
        loading: true
      }
    });

    expect(wrapper.find('input').element.value).toBe('Loading...');
  });

  it('copies text to clipboard and shows toast on success', async () => {
    const wrapper = mount(ApiKeyElement, {
      props: {
        label: 'API Key',
        value: 'test_key_value',
        loading: false
      }
    });

    const copyTextSpan = wrapper.find('span.font-medium.text-sm.text-gray-700:not(.mb-6)');
    await copyTextSpan.trigger('click');

    expect(writeTextMock).toHaveBeenCalledWith('test_key_value');
    expect(toast.success).toHaveBeenCalledWith('Copied');
  });

  it('handles clipboard error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    writeTextMock.mockRejectedValueOnce(new Error('Clipboard error'));

    const wrapper = mount(ApiKeyElement, {
      props: {
        label: 'API Key',
        value: 'test_key_value',
        loading: false
      }
    });

    const copyTextSpan = wrapper.find('span.font-medium.text-sm.text-gray-700:not(.mb-6)');
    await copyTextSpan.trigger('click');

    expect(writeTextMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy: ', expect.any(Error));
    expect(toast.success).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
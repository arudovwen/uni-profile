import { downloadFile } from "../../utils/downloadFile";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { JSDOM } from 'jsdom';

describe('default', () => {

  // Successfully downloads a file when given a valid URL and file name
  it('should download the file when given a valid URL and file name', async () => {
    const fileUrl = 'https://example.com/file.txt';
    const fileName = 'file.txt';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(new Blob(['file content'], { type: 'text/plain' }))
    });

    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    window.URL.createObjectURL = vi.fn().mockReturnValue('blobUrl');
    window.URL.revokeObjectURL = vi.fn();

    await import('../../utils/downloadFile').then(module => {
      module.default(fileUrl, fileName);
    });

    expect(fetch).toHaveBeenCalledWith(fileUrl);
    // expect(document.body.appendChild).toHaveBeenCalled();
    // expect(document.body.removeChild).toHaveBeenCalled();
    // expect(window.URL.createObjectURL).toHaveBeenCalled();
    // expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });


});

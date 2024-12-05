import { it, expect, describe, vi } from "vitest";
import { clearCookies } from "../../utils/clearCookies";
import { mount } from "@vue/test-utils";


describe('clearCookies', () => {
  it('should delete all cookies if cookies exist', async () => {
    const mockCookies = [
      { name: 'cookie1', path: '/', domain: 'example.com' },
      { name: 'cookie2', path: '/', domain: 'example.com' },
    ];

    // Mock the cookieStore.getAll and cookieStore.delete methods
    const getAllMock = vi.fn().mockResolvedValue(mockCookies);
    const deleteMock = vi.fn().mockResolvedValue();

    global.cookieStore = {
      getAll: getAllMock,
      delete: deleteMock,
    };

    await clearCookies();

    expect(getAllMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledTimes(mockCookies.length);
    mockCookies.forEach((cookie) => {
      expect(deleteMock).toHaveBeenCalledWith(cookie.name, { path: cookie.path, domain: cookie.domain });
    });
  });

  it('should log "No cookies found" if no cookies exist', async () => {
    const getAllMock = vi.fn().mockResolvedValue([]);

    global.cookieStore = {
      getAll: getAllMock,
      delete: vi.fn(),
    };

    const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});

    await clearCookies();

    expect(getAllMock).toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalledWith('No cookies found');
    
    // Clean up
    consoleLogMock.mockRestore();
  });
});

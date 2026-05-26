import { it, expect, describe, vi } from "vitest";
import { clearCookies } from "../../utils/clearCookies";

describe('clearCookies', () => {
  it('should delete all cookies if cookies exist', async () => {
    const mockCookies = [
      { name: 'cookie1', path: '/', domain: 'example.com' },
      { name: 'cookie2', path: '/', domain: 'example.com' },
    ];

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

  it('should return safely and not attempt deletion if no cookies exist', async () => {
    const getAllMock = vi.fn().mockResolvedValue([]);
    const deleteMock = vi.fn().mockResolvedValue();

    global.cookieStore = {
      getAll: getAllMock,
      delete: deleteMock,
    };

    await clearCookies();

    expect(getAllMock).toHaveBeenCalled();
    expect(deleteMock).not.toHaveBeenCalled();
  });
});
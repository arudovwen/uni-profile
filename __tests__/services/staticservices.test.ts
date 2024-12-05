// getcountries.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { getcountries } from "~/services/staticservices";
import urls from "~/helpers/url_helpers";
import { get } from "~/helpers/api_helpers";

// Mock get method from api_helpers
vi.mock("~/helpers/api_helpers");

describe("getcountries Function", () => {
  const mockConfig = {
    headers: { Authorization: "Bearer mock-access-token" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test for getcountries function
  it("should call getcountries with the correct URL and config", async () => {
    const expectedResponse = { data: "mock-response" };

    get.mockResolvedValue(expectedResponse);

    const response = await getcountries(mockConfig);

    expect(get).toHaveBeenCalledWith(urls.GET_COUNTRIES, mockConfig);
    expect(response).toEqual(expectedResponse);
  });

  
  // Test for getcountries function with default config
  it("should call getcountries with the correct URL and default config", async () => {
    const expectedResponse = { data: "mock-response" };

    get.mockResolvedValue(expectedResponse);

    const response = await getcountries();

    expect(get).toHaveBeenCalledWith(urls.GET_COUNTRIES, {});
    expect(response).toEqual(expectedResponse);
  });
});

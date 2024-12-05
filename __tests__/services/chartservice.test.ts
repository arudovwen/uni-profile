// statistical_data_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as statisticalDataHelpers from "~/services/chartservice";
// import urls from "~/helpers/url_helpers";
import { get } from "~/helpers/api_helpers";
// import store from "~/store";
// import { withRetryHandling } from "~/utils/retry-handling";

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
}));

vi.mock("~/store", () => ({
  default: {
    getters: {
      accessToken: "mock-access-token",
    },
  },
}));

vi.mock("~/helpers/url_helpers", () => ({
  default: {
    STAT_TREND: "mock-stat-trend-url",
    ORDER_TREND: "mock-top-products-url",
    CHART_TREND: "mock-chart-trend-url",
  },
}));

describe("Statistical Data Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should call getorderchart with the correct URL, data, and config", async () => {
    const mockData = { To: "2023-01-01", From: "2023-06-30" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await statisticalDataHelpers.getorderchart(mockData);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });
  it("should call getchart with the correct URL, data, and config", async () => {
    const mockData = { To: "2023-01-01", From: "2023-06-30" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await statisticalDataHelpers.getchart(mockData);

    expect(get).toHaveBeenCalled();
    expect(response).toEqual({ data: "mock-response" });
  });
});

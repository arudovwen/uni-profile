// finance_helpers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as financeHelpers from "~/services/financeservice";
// import urls from "~/helpers/url_helpers";
import { get, post, put, del } from "~/helpers/api_helpers";
// import store from "~/store";
// import { cleanObject } from "~/utils/cleanObject";

// Mock store and helpers
vi.mock("~/helpers/api_helpers", () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
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
    GET_ALL_FINANCE: "mock-get-all-finance-url",
    ADD_FINANCE: "mock-add-finance-url",
    GET_FINANCE_STAT: "mock-get-finance-stat-url",
    EDIT_FINANCE: "mock-edit-finance-url",
    WITHDRAW_FINANCE: "mock-withdraw-finance-url",
    UPDATE_APPROVE_FINANCE: "mock-update-approve-finance-url",
    GET_FINANCE: "mock-get-finance-url",
  },
}));

describe("Finance Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getAllFinance with the correct URL, data, and config", async () => {
    const mockData = { financeRequestStatus_In: ["approved", "pending"] };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await financeHelpers.getAllFinance(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-get-all-finance-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call addFinance with the correct URL, data, and config", async () => {
    const mockData = { customerId: "mock-customer-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await financeHelpers.addFinance(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-add-finance-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });


  it("should call editFinance with the correct URL, data, and config", async () => {
    const mockData = { id: "mock-id", customerId: "mock-customer-id" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    put.mockResolvedValue({ data: "mock-response" });

    const response = await financeHelpers.editFinance(mockData);

    expect(put).toHaveBeenCalledWith(
      "mock-edit-finance-url/mock-id",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call updateFinanceStatus with the correct URL, data, and config", async () => {
    const mockData = { someKey: "someValue" };
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    post.mockResolvedValue({ data: "mock-response" });

    const response = await financeHelpers.updateFinanceStatus(mockData);

    expect(post).toHaveBeenCalledWith(
      "mock-update-approve-finance-url",
      mockData,
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });

  it("should call getFinance with the correct URL, data, and config", async () => {
    const mockData = "mock-finance-id";
    const expectedConfig = {
      headers: { Authorization: `Bearer mock-access-token` },
    };

    get.mockResolvedValue({ data: "mock-response" });

    const response = await financeHelpers.getFinance(mockData);

    expect(get).toHaveBeenCalledWith(
      "mock-get-finance-url?id=mock-finance-id",
      expectedConfig
    );
    expect(response).toEqual({ data: "mock-response" });
  });
});

import { describe, expect, it } from "vitest";
import updateData from "~/utils/updateData";

describe("updateData", () => {
  // correctly assigns form.id and form.ProductId from route.query.id
  it("should assign form.id and form.ProductId from route.query.id when route.query.id is defined", () => {
    const form = {};
    const product = { value: {} };
    const defaultPackagesAvailable: any = [];
    const isLoading = { value: true };
    const route = { query: { id: "123" } };

		
    updateData(form, product, defaultPackagesAvailable, isLoading, route);
		
		// @ts-ignore
    expect(form.ProductId).toBe("123");
  });
});

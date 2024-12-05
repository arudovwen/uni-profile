import { it, expect, describe } from "vitest";
import { cleanObject } from "../../utils/cleanObject";
import { mount } from "@vue/test-utils";

describe("cleanObject", () => {
  // removes keys with null values
  it("should remove keys with null values", () => {
    const input = { a: 1, b: null, c: 2 };
    const expected = { a: 1, c: 2 };
    const result = cleanObject(input);
    expect(result).toEqual(expected);
  });

  // removes keys with undefined values
  it("should remove keys with undefined values", () => {
    const input = { a: 1, b: undefined, c: 2 };
    const expected = { a: 1, c: 2 };
    const result = cleanObject(input);
    expect(result).toEqual(expected);
  });

  // handles empty object
  it("should handle empty object", () => {
    const input = {};
    const expected = {};
    const result = cleanObject(input);
    expect(result).toEqual(expected);
  });

  // handles object with all null values
  it("should handle object with all null values", () => {
    const input = { a: null, b: null, c: null };
    const expected = {};
    const result = cleanObject(input);
    expect(result).toEqual(expected);
  });

  // handles object with all undefined values
  it("should handle object with all undefined values", () => {
    const input = { a: undefined, b: undefined, c: undefined };
    const expected = {};
    const result = cleanObject(input);
    expect(result).toEqual(expected);
  });
});

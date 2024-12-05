import { it, expect, describe } from "vitest";
import { ucFirst } from "../../utils/ucFirst";
import { mount } from "@vue/test-utils";

describe('ucFirst function', () => {
  it('should capitalize the first letter of a word', () => {
    const result = ucFirst('hello');
    expect(result).toBe('Hello');
  });

  it('should handle empty string gracefully', () => {
    const result = ucFirst('');
    expect(result).toBe('');
  });

  it('should handle already capitalized strings', () => {
    const result = ucFirst('Hello');
    expect(result).toBe('Hello');
  });

  it('should handle non-string inputs', () => {
    const result1 = ucFirst(123); // Number input
    const result2 = ucFirst(null); // Null input
    const result3 = ucFirst(undefined); // Undefined input

    expect(result1).toBe(123); // Return original number
    expect(result2).toBe(null); // Return original null
    expect(result3).toBe(undefined); // Return original undefined
  });

  it('should handle strings with special characters', () => {
    const result = ucFirst('@world');
    expect(result).toBe('@world'); // No change because '@' is not a letter
  });
});

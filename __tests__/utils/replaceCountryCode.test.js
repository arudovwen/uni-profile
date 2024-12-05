import { it, expect, describe } from "vitest";
import { replaceCountryCode } from "../../utils/replaceCountryCode";
import { mount } from "@vue/test-utils";


describe('replaceCountryCode function', () => {
  it('should replace country code with "0" in a phone number', () => {
    const phoneNumber = '+1234567890';
    const countryCode = '+123';

    const result = replaceCountryCode(phoneNumber, countryCode);

    expect(result).toBe('04567890');
  });

  it('should handle phone numbers without country code', () => {
    const phoneNumber = '1234567890';
    const countryCode = '+123';

    const result = replaceCountryCode(phoneNumber, countryCode);

    expect(result).toBe('1234567890');
  });


  it('should handle phone numbers that do not include the country code', () => {
    const phoneNumber = '+1234567890';
    const countryCode = '+999';

    const result = replaceCountryCode(phoneNumber, countryCode);

    expect(result).toBe('+1234567890');
  });

  it('should handle phone numbers starting with "0" after replacement', () => {
    const phoneNumber = '+1234567890';
    const countryCode = '+123';

    const result = replaceCountryCode(phoneNumber, countryCode);

    expect(result.startsWith('0')).toBe(true);
  });

  it('should return error message when phone number or country code is missing', () => {
    const phoneNumber = '+1234567890';
    const countryCode = '';

    const result = replaceCountryCode(phoneNumber, countryCode);

    expect(result).toBe('Phone number and country code are required');
  });
});

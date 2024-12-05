import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";

const countryData = [
  { code: "AD", label: "Andorra", phone: "376", phoneLength: 6 },
  { code: "AE", label: "United Arab Emirates", phone: "971", phoneLength: 9 },
  { code: "AF", label: "Afghanistan", phone: "93", phoneLength: 9 },
  { code: "AG", label: "Antigua and Barbuda", phone: "1-268", phoneLength: 10 },
  { code: "AI", label: "Anguilla", phone: "1-264", phoneLength: 10 },
  { code: "AL", label: "Albania", phone: "355", phoneLength: 9 },
  { code: "AM", label: "Armenia", phone: "374", phoneLength: 6 },
  { code: "AO", label: "Angola", phone: "244", phoneLength: 9 },
  { code: "AQ", label: "Antarctica", phone: "672", phoneLength: 6 },
  { code: "AR", label: "Argentina", phone: "54", phoneLength: [6, 7, 8] },
  { code: "AS", label: "American Samoa", phone: "1-684", phoneLength: 10 },
  { code: "AT", label: "Austria", phone: "43", phoneLength: [10, 11] },
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggested: true,
    phoneLength: 9,
  },]
describe('Country Phone Lengths', () => {
  countryData.forEach(({ code, label, phoneLength, min, max }) => {
    it(`should validate phone length for ${label} (${code})`, () => {
      if (Array.isArray(phoneLength)) {
        phoneLength.forEach(length => {
          expect(typeof length).toBe('number');
          expect(length).toBeGreaterThan(0);
        });
      } else if (min && max) {
        expect(typeof min).toBe('number');
        expect(typeof max).toBe('number');
        expect(min).toBeGreaterThan(0);
        expect(max).toBeGreaterThanOrEqual(min);
      } else {
        expect(typeof phoneLength).toBe('number');
        expect(phoneLength).toBeGreaterThan(0);
      }
    });
  });
});
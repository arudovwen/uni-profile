// constants.test.js

import {
    measurements,
    testimonialData,
    documentsOptions,
    languagesOptions,
    languagesOptionsMini,
    FinancesOptions,
    buyerRoutes,
    vendorRoutes,
    navigation,
    LedgerAction,
    languages,
  } from '~/utils/constants'; // Adjust the import path based on your actual file structure
  
  describe('Constants', () => {
    test('Measurements should be defined and have correct structure', () => {
      expect(measurements).toBeDefined();
      expect(Array.isArray(measurements)).toBe(true);
      expect(measurements.length).toBeGreaterThan(0);
  
      measurements.forEach((measurement) => {
        expect(measurement).toHaveProperty('value');
        expect(measurement).toHaveProperty('name');
      });
    });
  
    test('Testimonial data should be defined and have correct structure', () => {
      expect(testimonialData).toBeDefined();
      expect(Array.isArray(testimonialData)).toBe(true);
      expect(testimonialData.length).toBeGreaterThan(0);
  
      testimonialData.forEach((testimonial) => {
        expect(testimonial).toHaveProperty('text');
        expect(testimonial).toHaveProperty('name');
      });
    });
  
    test('Documents options should be defined and have correct structure', () => {
      expect(documentsOptions).toBeDefined();
      expect(typeof documentsOptions).toBe('object');
  
      Object.values(documentsOptions).forEach((option) => {
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('short');
        expect(option).toHaveProperty('isNigeria');
        expect(option).toHaveProperty('isNonNigeria');
      });
    });
  
    test('Languages options should be defined and have correct structure', () => {
      expect(languagesOptions).toBeDefined();
      expect(Array.isArray(languagesOptions)).toBe(true);
      expect(languagesOptions.length).toBeGreaterThan(0);
  
      languagesOptions.forEach((language) => {
        expect(language).toHaveProperty('code');
        expect(language).toHaveProperty('name');
      });
    });
  
    // Additional tests for other constants omitted for brevity; follow similar patterns for each constant
  
    // Example:
    test('Finance Options should be defined and have correct structure', () => {
      expect(FinancesOptions).toBeDefined();
      expect(Array.isArray(FinancesOptions)).toBe(true);
      expect(FinancesOptions.length).toBeGreaterThan(0);
  
      FinancesOptions.forEach((option) => {
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('img');
        expect(option).toHaveProperty('text');
        expect(option).toHaveProperty('url');
      });
    });
  
    // Add more tests for other constants as needed
  });
  
  
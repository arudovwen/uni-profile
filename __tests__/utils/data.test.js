// constants.test.js

import {
    categories,
    navigations,
    mobileNavigation,
    financeMenu,
  } from '~/utils/data'; // Adjust the import path based on your actual file structure
  
  describe('Constants', () => {
    test('Categories should be defined and have correct structure', () => {
      expect(categories).toBeDefined();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
  
      categories.forEach((category) => {
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('key');
        expect(category).toHaveProperty('url');
        // Add more specific checks as needed based on your structure
      });
    });
  
    test('Navigations should be defined and have correct structure', () => {
      expect(navigations).toBeDefined();
      expect(navigations).toBeInstanceOf(Array);
      expect(navigations.length).toBeGreaterThan(0);
  
      navigations.forEach((navigation) => {
        expect(navigation).toHaveProperty('name');
        expect(navigation).toHaveProperty('key');
        expect(navigation.url).toBeNull(); // Example of checking specific property value
      });
    });
  
    test('Mobile Navigation should be defined and have correct structure', () => {
      expect(mobileNavigation).toBeDefined();
      expect(mobileNavigation).toBeInstanceOf(Array);
      expect(mobileNavigation.length).toBeGreaterThan(0);
  
      mobileNavigation.forEach((item) => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('key');
      });
    });
  
   
  
    test('Finance Menu should be defined and have correct structure', () => {
      expect(financeMenu).toBeDefined();
      expect(financeMenu).toBeInstanceOf(Array);
      expect(financeMenu.length).toBeGreaterThan(0);
  
      financeMenu.forEach((item) => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('url');
      });
    });
  });
  
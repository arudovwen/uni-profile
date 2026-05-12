import {
  documentsOptions,
  languagesOptions,
  languagesOptionsMini,
  appCodeColorMap,
  countryCodes,
  Navigation,
  intialRoute
} from '~/utils/constants';

describe('Constants', () => {
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

  test('App Code Color Map should have expected keys', () => {
    expect(appCodeColorMap).toHaveProperty('OXP975');
    expect(appCodeColorMap).toHaveProperty('FLU722');
    expect(appCodeColorMap['FLU722']).toBe('#021242');
  });

  test('Navigation should be an array with correct keys', () => {
    expect(Array.isArray(Navigation)).toBe(true);
    Navigation.forEach(item => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('key');
    });
  });

  test('Initial Route mapping should be correct', () => {
    expect(intialRoute[0]).toBe("/my-applications");
    expect(intialRoute[3]).toBe("/user-management");
  });
});
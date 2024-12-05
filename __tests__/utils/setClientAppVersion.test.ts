import { it, expect, describe } from "vitest";
import { setClientAppVersion } from "~/utils/setClientAppVersion";

describe('setClientAppVersion', () => {

    // sets a valid version string in localStorage
    it('should set a valid version string in localStorage', () => {
      const version = '1.0.0';
      setClientAppVersion(version);
      expect(localStorage.getItem('APP_VERSION')).toBe(version);
    });

});

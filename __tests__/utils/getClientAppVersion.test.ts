import { it, expect, describe } from "vitest";
import { getClientAppVersion } from "~/utils/getClientAppVersion";

describe("getClientAppVersion", () => {
  // returns the correct version when APP_VERSION is set in localStorage
  it("should return the correct version when APP_VERSION is set in localStorage", () => {
    localStorage.setItem("APP_VERSION", "1.2.3");
    const version = getClientAppVersion();
    expect(version).toBe("1.2.3");
  });


});

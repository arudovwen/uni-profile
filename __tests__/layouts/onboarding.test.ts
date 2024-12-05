import { it, expect, describe, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import onboarding from "~/layouts/onboarding.vue";

describe("onboarding", () => {
  it("Mounts without error", async () => {
    const component = render(onboarding);
    
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

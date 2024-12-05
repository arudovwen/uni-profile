import { it, expect, describe, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import custom from "~/layouts/custom.vue";

describe("custom", () => {
  it("Mounts without error", async () => {
    const component = render(custom);
    
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

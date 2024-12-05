import { it, expect, describe, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import auth from "~/layouts/auth.vue";

describe("auth", () => {
  it("Mounts without error", async () => {
    const component = render(auth);
    
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

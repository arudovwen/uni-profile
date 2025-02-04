import { it, expect, describe, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import register from "~/layouts/superadmin.vue";

describe("register", () => {
  it("Mounts without error", async () => {
    const component = render(register);
    
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

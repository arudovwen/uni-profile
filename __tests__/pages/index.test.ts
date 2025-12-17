import { it, expect, describe, vi } from "vitest";
import { render } from "@testing-library/vue";
import index from "~/pages/index.vue";
import { RouterLinkStub } from "@vue/test-utils";

// Helper to mock useAuthStore for different user categories
function mockAuthStore(userCategory?: number) {
  vi.stubGlobal("useAuthStore", () => ({
    userInfo: userCategory !== undefined ? { userCategory } : {},
  }));
}

describe("IndexPage", () => {
  it("renders with default layout when userCategory is not 0,3,4", async () => {
    mockAuthStore(2); // not in [0,3,4]
    const { container } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
    // container div should have container classes when not superadmin
    const div = container.querySelector("div");
    expect(div?.className).toContain("container");
  });

  it("uses superadmin layout when userCategory is 0", async () => {
    mockAuthStore(0);
    const { html } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
    // when superadmin, wrapper div should not include container classes
    expect(html()).not.toContain("container py-10 max-w-[900px] mx-auto");
  });

  it("uses superadmin layout when userCategory is 3", async () => {
    mockAuthStore(3);
    const { html } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
    expect(html()).not.toContain("container py-10 max-w-[900px] mx-auto");
  });

  it("uses superadmin layout when userCategory is 4", async () => {
    mockAuthStore(4);
    const { html } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
    expect(html()).not.toContain("container py-10 max-w-[900px] mx-auto");
  });

  it("renders PagesSettings component placeholder", async () => {
    mockAuthStore(2);
    const { html } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
    // PagesSettings is stubbed, but index should include its tag
    expect(html()).toContain("pages-settings-stub");
  });
});

import { it, expect, describe, vi } from "vitest";
import { render } from "@testing-library/vue";
import index from "~/pages/index.vue";
import { RouterLinkStub } from "@vue/test-utils";

function mockAuthStore(userCategory?: number) {
  vi.stubGlobal("useAuthStore", () => ({
    userInfo: userCategory !== undefined ? { userCategory } : {},
  }));
}

describe("IndexPage", () => {
  const globalConfig = {
    stubs: {
      RouterLink: RouterLinkStub,
      NuxtLayout: {
        template: '<div><slot /></div>', 
      },
      PagesSettings: {
        template: '<div class="pages-settings-stub"></div>'
      }
    },
  };

  it("renders with default layout when userCategory is not 0,3,4", async () => {
    mockAuthStore(2); 
    const { container } = render(index, { global: globalConfig });

    const wrapper = container.querySelector(".container");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("container");
    expect(wrapper?.className).toContain("py-10");
  });

  it("uses superadmin layout when userCategory is 0", async () => {
    mockAuthStore(0);
    const { html } = render(index, {
      global: {
        stubs: { RouterLink: RouterLinkStub, NuxtLayout: true, PagesSettings: true },
      },
    });
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
});

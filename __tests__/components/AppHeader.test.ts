import { render, screen, fireEvent } from "@testing-library/vue";
import { it, expect, describe, vi } from "vitest";
import { RouterLinkStub } from "@vue/test-utils";
import AppHeader from "~/components/AppHeader.vue";
import { createTestingPinia } from "@pinia/testing";

describe("AppHeader", () => {
  vi.mock("~/services/notificationservice", () => ({
    getnotification: vi.fn().mockResolvedValue({
      data: {
        text: "/images/test-banner.png",
      },
    }),
  }));
  vi.mock("~/services/authservices", () => ({
    logOut: vi.fn().mockResolvedValue({
      data: {},
    }),
  }));
  it("renders with logged in user", async () => {
    const component = render(AppHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                loggedUser: {
                  fullName: "Oduro Tolulope",
                  phoneNumber: "07036845422",
                },
              },
            },
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Assert on specific elements or classes
    expect(screen.getByTestId("deal-container").classList[0]).toBe(
      "bg-[#1849A9]"
    );
    expect(component.html()).toContain(
      "Get N50,000 off when you sign up and make your first purchase."
    );

    // Simulate user interaction
    await fireEvent.click(screen.getByText("Markets"));
    await fireEvent.click(screen.getByText("Applications"));
    await fireEvent.click(screen.getByText("Request a product"));

    component.unmount();
  });

  it("renders without logged in user", async () => {
    const component = render(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Assert on specific elements or classes
    expect(screen.getByTestId("deal-container").classList[0]).toBe(
      "bg-[#1849A9]"
    );
    expect(component.html()).toContain(
      "Get N50,000 off when you sign up and make your first purchase."
    );

    // Simulate user interaction
    await fireEvent.click(screen.getByText("Markets"));
    await fireEvent.click(screen.getByText("Applications"));
    await fireEvent.click(screen.getByText("Request a product"));

    component.unmount();
  });
});

import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

const mockNavigateTo = vi.fn();
const mockSetLoggedUser = vi.fn();
const mockSaveAuthProfile = vi.fn();

const profiles = ref([
  {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@mail.com",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    email: "current@mail.com",
  },
]);

vi.mock("~/stores/auth", () => ({
  useAuthStore: () => ({
    userInfo: {
      email: "current@mail.com",
    },
    setLoggedUser: mockSetLoggedUser,
  }),
}));

vi.mock("~/composables/useEncryptedCookie", () => ({
  useEncryptedCookie: vi.fn(() => profiles),
}));

vi.mock("~/utils/auth", () => ({
  saveAuthProfile: mockSaveAuthProfile,
}));

vi.stubGlobal("navigateTo", mockNavigateTo);
vi.stubGlobal("PROFILE_COOKIE_NAME", "profile");
vi.stubGlobal("defaultOptions", {});

import MultiApps from "@/components/MultiApps.vue";

describe("MultiApps", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    profiles.value = [
      {
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        email: "john@mail.com",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        fullName: "Jane Smith",
        email: "current@mail.com",
      },
    ];
  });

  const factory = () =>
    mount(MultiApps, {
      global: {
        stubs: {
          AppIcon: true,
          ModalCenter: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

  it("renders filtered profiles", () => {
    const wrapper = factory();

    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).not.toContain("Jane Smith");
  });

  it("opens add another account link", async () => {
  const wrapper = factory();

  const addAccountButton = wrapper.findAll("button")[0];

  expect(addAccountButton.exists()).toBe(true);

  await addAccountButton.trigger("click");
});

  it("opens and closes sign out modal", async () => {
    const wrapper = factory();

    const logoutButton = wrapper.findAll("button")[1];

    await logoutButton.trigger("click");

    expect(wrapper.text()).toContain(
      "Are you sure you want to sign out?"
    );

    const cancelButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Cancel");

    await cancelButton?.trigger("click");

    expect(wrapper.text()).not.toContain(
      "Are you sure you want to sign out?"
    );
  });

  it("handles logout", async () => {
    delete (window as any).location;

    (window as any).location = {
      href: "",
    };

    const wrapper = factory();

    const logoutButton = wrapper.findAll("button")[1];

    await logoutButton.trigger("click");

    const yesButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Yes");

    await yesButton?.trigger("click");

    expect(window.location.href).toBe("/auth/logout");
  });

  it("handles empty profile list", () => {
    profiles.value = [];

    const wrapper = factory();

    expect(wrapper.text()).not.toContain("John Doe");
  });
});
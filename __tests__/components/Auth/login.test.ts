import { it, expect, describe, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  useHead: vi.fn(),
  setLoggedUser: vi.fn(),
  handleRedirect: vi.fn(),
  saveAuthProfile: vi.fn(),
  loginUser: vi.fn(),
  loginUser2FA: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  route: {
    params: { app: "MAT460", auth: "vendor" },
    query: {},
  },
}));

vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoute: vi.fn(() => mocks.route),
    useRouter: vi.fn(() => ({ push: mocks.push })),
  };
});

vi.mock("#app", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoute: vi.fn(() => mocks.route),
    useRouter: vi.fn(() => ({ push: mocks.push })),
    useHead: mocks.useHead,
  };
});

vi.mock("~/stores/auth", () => ({
  useAuthStore: vi.fn(() => ({
    appList: [
      { code: "MAT460", name: "Matta" },
      { code: "FLU722", name: "Fluid" },
    ],
    setLoggedUser: mocks.setLoggedUser,
  })),
}));

vi.mock("~/services/authservices", () => ({
  loginUser: mocks.loginUser,
  loginUser2FA: mocks.loginUser2FA,
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("~/utils/saveAuthProfile", () => ({
  saveAuthProfile: mocks.saveAuthProfile,
}));

vi.mock("~/utils/handleRedirect", () => ({
  handleRedirect: mocks.handleRedirect,
}));

vi.mock("~/utils/handleRouting", () => ({
  handleRouting: vi.fn((route, path) => path),
}));

import Login from "@/components/Auth/login.vue";

const globalConfig = {
  stubs: {
    NuxtLayout: { props: ["name"], template: `<div><slot /></div>` },
    NuxtLink: { props: ["to"], template: `<a><slot /></a>` },
    TextinputTwo: {
      props: ["modelValue", "error", "type", "name"],
      emits: ["update:modelValue"],
      template: `<input :type="type" :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
    },
    AppButton: {
      props: ["isLoading", "isDisabled", "text", "type", "btnClass"],
      template: `<button type="submit" :disabled="isDisabled">{{ text }}</button>`,
    },
    AuthOtp: {
      props: ["email", "title", "isVerifyPin", "isVerified", "isLoading", "subtext", "buttonText", "continueLink"],
      emits: ["handleSubmit", "close"],
      template: `<div class="otp-stub"><button id="submit-otp" @click="$emit('handleSubmit', '1234')">Verify</button><button id="close-otp" @click="$emit('close')">Close</button></div>`,
    },
  },
};

const setRoute = (params) => {
  mocks.route.params = params;
  mocks.route.query = {};
};

describe("login.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("location", { replace: mocks.replace });
    vi.stubGlobal("window", { location: { replace: mocks.replace }, innerWidth: 1024 });
    vi.stubGlobal("fbq", vi.fn());
    vi.stubGlobal("appCodeColorMap", { MAT460: "#1570EF", FLU722: "#000000" });
    vi.stubGlobal("intialRoute", { admin: "/admin/dashboard", vendor: "/vendor/dashboard" });
    vi.stubGlobal("handleRedirect", mocks.handleRedirect);
    vi.stubGlobal("handleRouting", (route, path) => path);
    setRoute({ app: "MAT460", auth: "vendor" });
  });

  const submit = async (wrapper) => {
    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("password123");
    await flushPromises();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
  };

  it("renders welcome text on step 1", async () => {
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.text()).toContain("Welcome Back! Please enter your details");
  });

  it("renders forgot password link", async () => {
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.text()).toContain("Forgot password?");
  });

  it("renders sign up link", async () => {
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.text()).toContain("Sign Up");
  });

  it("does not call useHead for unknown app", async () => {
    setRoute({ app: "OTHER", auth: "vendor" });
    await mountSuspended(Login, { global: globalConfig });
    expect(mocks.useHead).not.toHaveBeenCalled();
  });

  it("uses fallback color for unknown app code", async () => {
    setRoute({ app: "UNKNOWN", auth: "vendor" });
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.vm.color).toBe("#1570EF");
  });

  it("uses correct color for MAT460", async () => {
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.vm.color).toBe("#1570EF");
  });

  it("renders email and password inputs", async () => {
    const wrapper = await mountSuspended(Login, { global: globalConfig });
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });
});
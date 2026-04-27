import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import AuthModal from "@/components/Modal/Auth.vue";

vi.mock("@/components/Auth/Login.vue", () => ({
  default: {
    name: "AuthLogin",
    template: '<button class="login-stub" @click="$emit(\'close\')" @toggleAuth="$emit(\'toggleAuth\', \'register\')">Login</button>',
    props: ["main"]
  }
}));

vi.mock("@/components/Auth/VendorSignUp.vue", () => ({
  default: {
    name: "AuthVendorSignUp",
    template: '<button class="register-stub" @click="$emit(\'close\')" @toggleAuth="$emit(\'toggleAuth\', \'login\')">Register</button>',
    props: ["main"]
  }
}));

describe("Auth.vue", () => {
  const mockGetMyCart = vi.fn();
  const mockHandleOrderRequest = vi.fn();
  const mockHandleProceed = vi.fn();

  const createWrapper = (injections = {}, props = {}) => {
    return mount(AuthModal, {
      props: {
        canClose: true,
        className: "custom-modal",
        ...props,
      },
      global: {
        provide: {
          authOpen: ref(true),
          action: ref("call"),
          handleOrderRequest: mockHandleOrderRequest,
          handleProceed: mockHandleProceed,
          ...injections,
        },
        stubs: {
          TransitionRoot: { props: ["show"], template: '<div v-if="show"><slot /></div>' },
          TransitionChild: { template: "<div><slot /></div>" },
          Dialog: { template: "<div><slot /></div>" },
          DialogOverlay: { template: "<div />" },
          AppIcon: { template: "<i />" }
        },
        mocks: {
          cartStore: { getMyCart: mockGetMyCart }
        }
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("switches between login and registration views", async () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".login-stub").exists()).toBe(true);

    await wrapper.find(".login-stub").trigger("toggleAuth");
    expect(wrapper.find(".register-stub").exists()).toBe(true);
    
    await wrapper.find(".register-stub").trigger("toggleAuth");
    expect(wrapper.find(".login-stub").exists()).toBe(true);
  });

  it("handles the close event for 'call' action", async () => {
    const authOpen = ref(true);
    const action = ref("call");
    const wrapper = createWrapper({ authOpen, action });

    await wrapper.find(".login-stub").trigger("click");
    
    expect(authOpen.value).toBe(false);
    expect(mockGetMyCart).toHaveBeenCalled();

    const callback = mockGetMyCart.mock.calls[0][1];
    callback();
    expect(mockHandleOrderRequest).toHaveBeenCalled();
  });

  it("handles the close event for non-call actions", async () => {
    const authOpen = ref(true);
    const action = ref("checkout");
    const wrapper = createWrapper({ authOpen, action });

    await wrapper.find(".login-stub").trigger("toggleAuth");
    await wrapper.find(".register-stub").trigger("click");
    
    const callback = mockGetMyCart.mock.calls[0][1];
    callback();
    expect(mockHandleProceed).toHaveBeenCalled();
  });

  it("manually resets state and closes via close button", async () => {
    const authOpen = ref(true);
    const wrapper = createWrapper({ authOpen });

    await wrapper.find(".login-stub").trigger("toggleAuth");
    const closeBtn = wrapper.find(".cursor-pointer");
    await closeBtn.trigger("click");

    expect(authOpen.value).toBe(false);
    expect(wrapper.find(".login-stub").exists()).toBe(true);
  });

  it("applies props for custom styling and close visibility", () => {
    const wrapper = createWrapper({}, { canClose: false, className: "test-bg" });
    expect(wrapper.find(".test-bg").exists()).toBe(true);
    expect(wrapper.find(".cursor-pointer").exists()).toBe(false);
  });

  it("renders nothing when authOpen is false", () => {
    const wrapper = createWrapper({ authOpen: ref(false) });
    expect(wrapper.find(".inline-block").exists()).toBe(false);
  });
});
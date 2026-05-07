import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import Information from "@/components/Pages/Superadmin/UserDetail/Information.vue";
import * as settingServices from "~/services/settingservices";
import * as userServices from "~/services/userservices";
import { toast } from "vue3-toastify";

/* ---------------- MOCKS ---------------- */

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("~/services/settingservices", () => ({
  updateUserProfile: vi.fn(),
}));

vi.mock("~/services/userservices", () => ({
  getSingleInvite: vi.fn(),
}));

// ✅ mock vee-validate so validation NEVER blocks submit
const mockSetValues = vi.fn();

vi.mock("vee-validate", () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => async () =>
      await fn({
        firstName: "John",
        lastName: "Doe",
        contactEmail: "john@example.com",
        phone: "1234567890",
        photo: "photo.jpg",
        category: "Tech",
      }),
    defineField: vi.fn(() => [ref(""), {}]),
    errors: ref({}),
    setFieldValue: vi.fn(),
    setValues: mockSetValues,
    values: {},
  }),
}));

/* ---------------- GLOBALS ---------------- */

vi.stubGlobal("useRoute", () => ({
  params: { id: "user_123" },
}));

vi.stubGlobal("useAuthStore", () => ({
  userInfo: { userCategory: 3 },
}));

/* ---------------- TEST ---------------- */

describe("Information Component", () => {
  const globalConfig = {
    stubs: {
      Textinput: {
        template: `<input class="text-input-stub" />`,
      },
      FormGroup: {
        template: `<div><slot /></div>`,
      },
      FormsPhoneCodes: {
        template: `<input class="phone-input-stub" />`,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(userServices.getSingleInvite).mockResolvedValue({
      status: 200,
      data: {
        data: {
          firstName: "John",
          lastName: "Doe",
          contactEmail: "john@example.com",
          phone: "1234567890",
          category: "Technology",
          photo: "photo.jpg",
        },
      },
    });
  });

  it("handles failed data fetch on mount", async () => {
    vi.mocked(userServices.getSingleInvite).mockResolvedValueOnce({
      status: 400,
    });

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    expect(wrapper.vm.firstName).toBe("");
    expect(wrapper.vm.lastName).toBe("");
    expect(wrapper.vm.contactEmail).toBe("");
    expect(wrapper.vm.phone).toBe("");
  });

  it("handles failed data fetch without crashing", async () => {
    vi.mocked(userServices.getSingleInvite).mockRejectedValueOnce(
      new Error("Network error")
    );

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    expect(wrapper.exists()).toBe(true);
  });

  it("handles submission error with response message", async () => {
    vi.mocked(settingServices.updateUserProfile).mockRejectedValue({
      response: { data: { message: "API Error" } },
    });

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith("API Error");
  });

  it("handles submission error with Message property", async () => {
    vi.mocked(settingServices.updateUserProfile).mockRejectedValue({
      response: { data: { Message: "Msg Error" } },
    });

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith("Msg Error");
  });

  it("handles submission error with default message", async () => {
    vi.mocked(settingServices.updateUserProfile).mockRejectedValue({});

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong, try again later"
    );
  });

  it("updates form values through setValues", async () => {
    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    wrapper.vm.setValues({
      firstName: "Jane",
      lastName: "Smith",
    });

    expect(mockSetValues).toHaveBeenCalled();
  });

  it("calls updateUserProfile on submit", async () => {
    vi.mocked(settingServices.updateUserProfile).mockResolvedValue({
      status: 200,
    });

    const wrapper = mount(Information, { global: globalConfig });

    await flushPromises();

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(settingServices.updateUserProfile).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Profile updated");
  });
});
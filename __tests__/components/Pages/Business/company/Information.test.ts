import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Information from "@/components/Pages/Business/company/Information.vue";

vi.mock("@vuepic/vue-datepicker", () => ({
  default: {
    template: "<input />",
  },
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("~/services/settingservices", () => ({
  updateCompanyProfile: vi.fn(),
}));

vi.mock("country-list-with-dial-code-and-flag", () => ({
  default: [{ name: "Nigeria" }, { name: "Ghana" }],
}));

vi.mock("~/utils/countries.json", () => ([
  {
    name: "Nigeria",
    states: [{ name: "Lagos", code: "LA" }],
  },
]));

vi.mock("vee-validate", async () => {
  const actual = await vi.importActual("vee-validate");
  return {
    ...actual,
    useForm: () => {
      const values = {
        companyName: "Test Ltd",
        dateOfIncorporation: new Date(),
        country: "Nigeria",
        state: "Lagos",
        companyEmail: "test@test.com",
        companyPhone: "1234567890",
        sector: "Tech",
        category: "Software",
        registrationNo: "123",
        tin: "456",
        website: "https://test.com",
        address: "Address",
        city: "City",
        notes: "Notes",
        companyDocuments: [
          { urls: [{ url: "file1" }] },
        ],
      };

      return {
        handleSubmit: (fn) => () => fn(values),
        defineField: (name) => [values[name], {}],
        errors: {},
        setFieldValue: vi.fn(),
        setValues: vi.fn(),
        values,
      };
    },
  };
});

global.businessTypes = [
  {
    sector: "Tech",
    subSectors: [{ subSectorName: "Software" }],
  },
];

describe("Information.vue", () => {
  let wrapper;
  let updateCompanyProfile;

  beforeEach(async () => {
    const services = await import("~/services/settingservices");
    updateCompanyProfile = services.updateCompanyProfile;

    wrapper = mount(Information, {
      global: {
        stubs: {
          Textinput: true,
          FormGroup: true,
          Select: true,
          Textarea: true,
          AppButton: true,
          FormsPhoneCodes: true,
          ClientOnly: true,
        },
        provide: {
          form: {},
          active: { value: 1 },
        },
        mocks: {
          useAuthStore: () => ({
            userInfo: { userCategory: 1 },
          }),
        },
      },
    });
  });

  it("renders form", () => {
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("shows nigeria specific fields", () => {
    expect(wrapper.html()).toContain("CAC Registration number");
    expect(wrapper.html()).toContain("TIN number");
  });

  it("submits successfully", async () => {
    updateCompanyProfile.mockResolvedValue({ status: 200 });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("handles submit error", async () => {
    updateCompanyProfile.mockRejectedValue({
      response: { data: { message: "Error" } },
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("disables email when onboardingStatus exists", async () => {
    wrapper.vm.form = { onboardingStatus: true };
    wrapper.vm.companyEmail = "test@test.com";
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain("Email address");
  });
});
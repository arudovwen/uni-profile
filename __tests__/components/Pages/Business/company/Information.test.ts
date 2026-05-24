import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, computed } from "vue";
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

vi.mock("~/utils/countries.json", () => ({
  default: [
    {
      name: "Nigeria",
      states: [{ name: "Lagos", code: "LA" }],
    },
  ],
}));

vi.mock("vee-validate", async () => {
  const actual = await vi.importActual("vee-validate");
  return {
    ...actual,
    useForm: (options) => {
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
        companyDocuments: [{ urls: [{ url: "file1" }] }],
      };

      return {
        handleSubmit: (fn) => () => fn(values),
        defineField: (name) => [ref(values[name]), {}],
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

global.useAuthStore = () => ({
  userInfo: { userCategory: 1 },
});

describe("Information.vue", () => {
  let wrapper;
  let updateCompanyProfile;
  let formObj;
  let activeObj;

  beforeEach(async () => {
    const services = await import("~/services/settingservices");
    updateCompanyProfile = services.updateCompanyProfile;

    formObj = { onboardingStatus: false };
    activeObj = ref(1);

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
          form: formObj,
          active: activeObj,
        },
      },
    });
  });

  it("renders form", () => {
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("shows nigeria specific fields", () => {
  expect(wrapper.find('[data-testid="registrationNo"]').exists()).toBe(true);
  
  expect(wrapper.html().toLowerCase()).toContain("tin");
});

  it("submits successfully", async () => {
    updateCompanyProfile.mockResolvedValue({ status: 200 });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
    expect(activeObj.value).toBe(2);
  });

  it("handles submit error with message", async () => {
    updateCompanyProfile.mockRejectedValue({
      response: { data: { message: "Error Occurred" } },
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("handles submit error with fallback Message key", async () => {
    updateCompanyProfile.mockRejectedValue({
      response: { data: { Message: "Capitalized Error" } },
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("handles submit error default message", async () => {
    updateCompanyProfile.mockRejectedValue({});

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("disables email when onboardingStatus exists", async () => {
  formObj.onboardingStatus = true;
  wrapper = mount(Information, {
    global: {
      stubs: {
        Textinput: {
          template: "<input class='stubbed-input' :name='$attrs.name' :disabled='$attrs.disabled' />",
        },
        FormGroup: true,
        Select: true,
        Textarea: true,
        AppButton: true,
        FormsPhoneCodes: true,
        ClientOnly: true,
      },
      provide: {
        form: formObj,
        active: activeObj,
      },
    },
  });

  const emailInput = wrapper.find("input[name='companyEmail']");
  expect(emailInput.attributes("disabled")).toBeDefined();
});

  it("computes empty array when category configuration is missing", () => {
    wrapper.vm.sector = "NonExistentSector";
    expect(wrapper.vm.categorysOptions).toEqual([]);
  });

  it("computes empty category subsectors gracefully when structure drops items", () => {
    global.businessTypes = [{ sector: "EmptyTech" }];
    wrapper.vm.sector = "EmptyTech";
    expect(wrapper.vm.categorysOptions).toEqual([]);
  });

  it("hides next action block when userCategory does not equal 1", () => {
    global.useAuthStore = () => ({
      userInfo: { userCategory: 2 },
    });
    const unprivilegedWrapper = mount(Information, {
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
          active: ref(1),
        },
      },
    });
    expect(unprivilegedWrapper.find("app-button-stub").exists()).toBe(false);
  });
});
import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import Kyb from "@/components/Pages/Financing/Kyb.vue";
import * as settingservices from "~/services/settingservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/settingservices", () => ({
  updateCompanyProfile: vi.fn(),
  updateDocuments: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockAuthStore = {
  userInfo: { email: "test@test.com" },
};
vi.stubGlobal("useAuthStore", () => mockAuthStore);

describe("Kyb.vue", () => {
  let wrapper;
  const active = ref(2);
  const getCompanyData = vi.fn();
  
  const validDocsNigeria = [
    { documentType: 0, urls: [{ url: "file0.pdf" }] },
    { documentType: 1, urls: [{ url: "file1.pdf" }] },
    { documentType: 2, urls: [{ url: "file2.pdf" }] },
    { documentType: 3, urls: [{ url: "file3.pdf" }] },
    { documentType: 4, urls: [{ url: "file4.pdf" }] },
  ];

  const mockFormData = {
    kyb: {
      companyName: "Test Corp",
      email: "test@test.com",
      phone: "+2348000000000",
      country: "Nigeria",
      state: "Lagos",
      city: "Ikeja",
      address: "123 Street",
      category: "Agric",
      sector: "Farming",
      dateOfIncorporation: new Date(),
      registrationNo: "12345678",
      tin: "111222333",
      companyDocuments: [...validDocsNigeria],
    },
  };

  const createWrapper = () => {
    return mount(Kyb, {
      global: {
        stubs: {
          Textinput: true,
          FormGroup: true,
          FormsPhoneCodes: true,
          SelectVueSelect: true,
          VueDatePicker: true,
          Select: true,
          Textarea: true,
          DocumentsUpload: true,
          AppButton: {
            template: '<button @click="$emit(\'click\')">{{text}}</button>',
            props: ['text']
          },
          ClientOnly: true,
        },
        provide: {
          company: ref({}),
          formData: mockFormData,
          active: active,
          getCompanyData: getCompanyData,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    active.value = 2;
    // Crucial: ensure these always return a promise by default to avoid .then() errors
    settingservices.updateCompanyProfile.mockResolvedValue({ status: 200 });
    settingservices.updateDocuments.mockResolvedValue({ status: 200 });
  });

  it("mounts and sets initial values", async () => {
    wrapper = createWrapper();
    await nextTick();
    expect(wrapper.vm.values.companyName).toBe("Test Corp");
  });

  it("decrements active step when Back is clicked", async () => {
    wrapper = createWrapper();
    const backBtn = wrapper.findAll("button").find(b => b.text() === "Back");
    await backBtn.trigger("click");
    expect(active.value).toBe(1);
  });

  it("updates documents via handleDocUpdate", () => {
    wrapper = createWrapper();
    const newDocs = [{ documentType: 0, urls: [{ url: "new.pdf" }] }];
    wrapper.vm.handleDocUpdate(newDocs);
    expect(wrapper.vm.values.companyDocuments).toEqual(newDocs);
  });

  it("watches country and updates documents for non-Nigerian selection", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("country", "United States");
    await nextTick();
    const filtered = wrapper.vm.values.companyDocuments.every(d => [0, 4].includes(d.documentType));
    expect(filtered).toBe(true);
  });

  it("watches country and adds default documents for Nigeria", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("country", "Ghana");
    await nextTick();
    wrapper.vm.setFieldValue("country", "Nigeria");
    await nextTick();
    expect(wrapper.vm.values.companyDocuments.length).toBeGreaterThanOrEqual(3);
  });

  it("fails submission if Nigerian documents are incomplete", async () => {
    wrapper = createWrapper();
    wrapper.vm.setValues({ ...mockFormData.kyb, companyDocuments: [] });
    await nextTick();
    await wrapper.find("form").trigger("submit");
    await new Promise(r => setTimeout(r, 100)); 
    expect(toast.error).toHaveBeenCalledWith("Please upload all available document types");
  });

  it("successfully submits and updates profile", async () => {
    wrapper = createWrapper();
    wrapper.vm.setValues({ ...mockFormData.kyb, companyDocuments: [...validDocsNigeria] });
    await nextTick();
    
    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(settingservices.updateCompanyProfile).toHaveBeenCalled();
    expect(active.value).toBe(3);
  });

  it("handles profile update failure", async () => {
    const errorMsg = "Update failed";
    settingservices.updateCompanyProfile.mockRejectedValue({
      response: { data: { message: errorMsg } }
    });
    wrapper = createWrapper();
    wrapper.vm.setValues({ ...mockFormData.kyb, companyDocuments: [...validDocsNigeria] });
    await nextTick();
    
    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(toast.error).toHaveBeenCalledWith(errorMsg);
  });

  it("handles document update failure after profile success", async () => {
    settingservices.updateDocuments.mockRejectedValue({
      response: { data: { Message: "Doc error" } }
    });
    wrapper = createWrapper();
    wrapper.vm.setValues({ ...mockFormData.kyb, companyDocuments: [...validDocsNigeria] });
    await nextTick();

    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(toast.error).toHaveBeenCalledWith("Doc error");
  });

  it("computes states based on selected country", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("country", "Nigeria");
    await nextTick();
    expect(wrapper.vm.mystates.length).toBeGreaterThan(0);
  });

  it("returns empty states if country is not found", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("country", "NonExistentCountry");
    await nextTick();
    expect(wrapper.vm.mystates || []).toEqual([]);
  });

  it("computes sectorOptions based on selected category", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("category", "Agric");
    await nextTick();
    expect(wrapper.vm.sectorOptions).toBeDefined();
  });
});
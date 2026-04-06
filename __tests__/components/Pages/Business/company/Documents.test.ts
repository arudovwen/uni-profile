import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ref, reactive, nextTick, computed } from "vue";
import Documents from "@/components/Pages/Business/company/Documents.vue";
import { updateCompanyProfile } from "~/services/settingservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/settingservices", () => ({
  updateCompanyProfile: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/stores/auth", () => ({
  useAuthStore: vi.fn(() => ({
    userInfo: { userCategory: 1 },
  })),
}));

describe("Documents.vue", () => {
  let companyInfo;
  let form;
  let active;

  beforeEach(() => {
    vi.clearAllMocks();
    companyInfo = ref({
      approvalStatus: false,
      companyDocuments: [
        { documentType: 0, urls: [{ url: "test.pdf" }] },
        { documentType: 4, urls: [{ url: "test2.pdf" }] },
        { documentType: 1, urls: [] }
      ]
    });
    form = reactive({
      country: "nigeria",
      companyDocuments: []
    });
    active = ref(2);
  });

  const createWrapper = () => {
    return mount(Documents, {
      global: {
        provide: {
          companyInfo,
          form,
          active,
        },
        stubs: {
          PagesBusinessCompanyDocumentsUpload: true,
          AppButton: {
            props: ["text", "disabled"],
            template: '<button class="app-btn-stub" :disabled="disabled" @click="$emit(\'click\')">{{text}}</button>',
          },
        },
      },
    });
  };

  it("computes companyDoc correctly for non-Nigerian country", async () => {
    form.country = "ghana";
    const wrapper = createWrapper();
    await nextTick();
    expect(wrapper.vm.companyDoc.length).toBe(2);
    expect(wrapper.vm.companyDoc.every(d => [0, 4].includes(d.documentType))).toBe(true);
  });

  it("updates form.companyDocuments when handleDocUpdate is called", () => {
    const wrapper = createWrapper();
    const newData = [{ documentType: 1, urls: [] }];
    wrapper.vm.handleDocUpdate(newData);
    expect(form.companyDocuments).toEqual(newData);
  });

  it("validation fails for Nigeria if documents are missing or incomplete", async () => {
    form.country = "nigeria";
    form.companyDocuments = [{ documentType: 1, urls: [{ url: "" }] }];
    const wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    expect(toast.error).toHaveBeenCalledWith("Please upload all available document types");
  });

  it("validation fails for non-Nigeria if less than 2 documents or missing urls", async () => {
    form.country = "ghana";
    form.companyDocuments = [{ documentType: 0, urls: [{ url: "" }] }];
    const wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    expect(toast.error).toHaveBeenCalledWith("Please upload all available document types");
  });

  it("calls updateCompanyProfile successfully for Nigeria", async () => {
    form.country = "nigeria";
    form.companyDocuments = Array(5).fill(null).map((_, i) => ({
      documentType: i,
      urls: [{ url: `file${i}.pdf` }]
    }));
    updateCompanyProfile.mockResolvedValue({ status: 200 });
    
    const wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Documents saved");
    expect(active.value).toBe(3);
  });

  it("calls updateCompanyProfile successfully for non-Nigeria", async () => {
    form.country = "usa";
    form.companyDocuments = [
      { documentType: 0, urls: [{ url: "id.pdf" }] },
      { documentType: 4, urls: [{ url: "cert.pdf" }] }
    ];
    updateCompanyProfile.mockResolvedValue({ status: 200 });
    
    const wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateCompanyProfile).toHaveBeenCalled();
  });

  it("handles API error correctly", async () => {
    form.country = "usa";
    form.companyDocuments = [
      { documentType: 0, urls: [{ url: "id.pdf" }] },
      { documentType: 4, urls: [{ url: "cert.pdf" }] }
    ];
    const errorMsg = "Upload failed";
    updateCompanyProfile.mockRejectedValue({
      response: { data: { message: errorMsg } }
    });
    
    const wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith(errorMsg);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("hides footer if approvalStatus is true and document type 4 exists", async () => {
    companyInfo.value.approvalStatus = true;
    form.country = "nigeria";
    form.companyDocuments = [{ documentType: 4, urls: [{ url: 'test.com' }] }];
    const wrapper = createWrapper();
    await nextTick();
    expect(wrapper.find(".flex.justify-end").exists()).toBe(false);
  });
});
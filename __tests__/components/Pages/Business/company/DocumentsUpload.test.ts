import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import DocumentsUpload from "@/components/Pages/Business/company/DocumentsUpload.vue";

const mockDownload = vi.fn();
vi.stubGlobal("downloadFile", mockDownload);

const mockAuthStore = {
  userInfo: { userCategory: 1 }
};
vi.stubGlobal("useAuthStore", () => mockAuthStore);

const KYB_DEFAULTS = [
  { documentType: 0, urls: [{ url: "" }] },
  { documentType: 1, urls: [{ url: "" }] },
  { documentType: 2, urls: [{ url: "" }] },
  { documentType: 3, urls: [{ url: "" }] },
  { documentType: 4, urls: [{ url: "" }] }
];
vi.stubGlobal("KybDocumentDefault", KYB_DEFAULTS);

vi.stubGlobal("documentsOptions", {
  0: { title: "Registration", short: "Reg" },
  1: { title: "Tax", short: "Tax" },
  2: { title: "Util", short: "Util" },
  3: { title: "Mem", short: "Mem" },
  4: { title: "Other", short: "Other" }
});

describe("DocumentsUpload.vue", () => {
  const createWrapper = (props = {}) => {
    return mount(DocumentsUpload, {
      props: {
        documents: [],
        isNonNigerian: false,
        ...props
      },
      global: {
        stubs: {
          FormGroup: { template: '<div class="form-group-stub"><slot /></div>' },
          FileUpload: {
            props: ['modelValue', 'label'],
            template: '<input class="file-upload-input" :data-label="label" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
          }
        }
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.userInfo.userCategory = 1;
  });

  it("initializes with default documents if input is empty", () => {
    const wrapper = createWrapper({ documents: [] });
    expect(wrapper.vm.privateDocuments.length).toBe(5);
  });

  it("initializes with limited documents if isNonNigerian is true", () => {
    const wrapper = createWrapper({ 
      documents: [{ documentType: 0, urls: [{ url: "" }] }], 
      isNonNigerian: true 
    });
    const types = wrapper.vm.privateDocuments.map(d => d.documentType);
    expect(types).toContain(0);
    expect(types).toContain(4);
    expect(wrapper.vm.privateDocuments.length).toBe(2);
  });

  it("fills missing document types while preserving existing ones", () => {
    const existing = [{ documentType: 0, urls: [{ url: "exist.com" }] }];
    const wrapper = createWrapper({ documents: existing });
    const regDoc = wrapper.vm.privateDocuments.find(d => d.documentType === 0);
    expect(regDoc.urls[0].url).toBe("exist.com");
    expect(wrapper.vm.privateDocuments.length).toBe(5);
  });

  it("adds a new file field to a document group", async () => {
    const wrapper = createWrapper();
    wrapper.vm.addField(0);
    await nextTick();
    expect(wrapper.vm.privateDocuments[0].urls.length).toBe(2);
  });

  it("removes a specific file field from a document group", async () => {
    const wrapper = createWrapper();
    wrapper.vm.privateDocuments[0].urls = [{ url: "1" }, { url: "2" }];
    await nextTick();
    wrapper.vm.removeField(0, 1);
    expect(wrapper.vm.privateDocuments[0].urls.length).toBe(1);
  });

  it("emits getDocs when privateDocuments changes", async () => {
    const wrapper = createWrapper();
    wrapper.vm.privateDocuments[0].urls[0].url = "updated.pdf";
    await nextTick();
    expect(wrapper.emitted("getDocs")).toBeTruthy();
  });

  it("shows remove button only when more than one url exists", async () => {
    const wrapper = createWrapper();
    expect(wrapper.find("button.text-red-500").exists()).toBe(false);
    wrapper.vm.addField(0);
    await nextTick();
    expect(wrapper.find("button.text-red-500").exists()).toBe(true);
  });

  it("hides add button if userCategory is not 1", async () => {
    mockAuthStore.userInfo.userCategory = 2;
    const wrapper = createWrapper();
    await nextTick();
    expect(wrapper.find("button.text-primary-500").exists()).toBe(false);
  });

  it("updates file url via FileUpload v-model", async () => {
    const wrapper = createWrapper();
    await nextTick();
    const input = wrapper.find("input.file-upload-input");
    await input.setValue("new-file.png");
    expect(wrapper.vm.privateDocuments[0].urls[0].url).toBe("new-file.png");
  });
});
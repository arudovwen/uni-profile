import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, reactive, nextTick } from "vue";
import DirectorForm from "@/components/DirectorForm.vue";

const mockOpen = ref(true);
const mockFormData = reactive({ directors: [] });
const mockCompanyInfo = ref({ country: "Nigeria" });

vi.mock("vee-validate", () => ({
  useForm: vi.fn(() => ({
    handleSubmit: (cb) => (e) => {
      const values = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        phone: "1234567890",
        bvn: "11223344556",
        dob: new Date("1990-01-01"),
        address: "123 Street",
        linkedIn: "url",
        signatureUrl: "sig.png",
        identityUrl: "id.png",
        utilityBillUrl: "bill.png"
      };
      cb(values);
    },
    defineField: vi.fn(() => [ref(""), ref({})]),
    errors: reactive({}),
    setFieldValue: vi.fn((id, val) => {}),
    setFieldTouched: vi.fn(),
    isFieldTouched: vi.fn(() => true),
  })),
}));

describe("DirectorForm", () => {
  beforeEach(() => {
    mockOpen.value = true;
    mockFormData.directors = [];
    vi.clearAllMocks();
  });

  const createConfig = (props = {}) => ({
    props,
    global: {
      stubs: {
        Textinput: { template: '<input class="text-input" />' },
        FormGroup: { template: '<div><slot /></div>' },
        FormsPhoneCodes: { template: '<div class="phone-stub" />' },
        FileUpload: { template: '<div class="file-stub" />' },
        VueDatePicker: { template: '<div class="date-stub" />' },
        ClientOnly: { template: '<div><slot /></div>' },
      },
      provide: {
        open: mockOpen,
        form: mockFormData,
        companyInfo: mockCompanyInfo,
      },
    },
  });

  it("renders with initial state", () => {
    const wrapper = mount(DirectorForm, createConfig({ type: "add" }));
    expect(wrapper.find("h3").text()).toBe("Add director");
  });

  it("populates form when director prop is provided on mount", () => {
    const director = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@test.com",
      dob: "1985-05-05",
      identityUrl: "id.jpg"
    };
    const wrapper = mount(DirectorForm, createConfig({ director, type: "edit", id: 0 }));
    expect(wrapper.vm.form.firstName).toBe("Alice");
    expect(wrapper.vm.form.identityUrl).toBe("id.jpg");
  });

  it("toggles BVN field visibility based on country", async () => {
    const wrapper = mount(DirectorForm, createConfig({ type: "add" }));
    
    expect(wrapper.find('[data-testid="BVN"]').exists()).toBe(true);

    mockCompanyInfo.value = { country: "Ghana" };
    await nextTick();
    
    expect(wrapper.find('[data-testid="BVN"]').exists()).toBe(false);
  });

  it("handles file state updates and downloads", async () => {
    const wrapper = mount(DirectorForm, createConfig({ type: "add" }));
    
    wrapper.vm.form.signatureUrl = "sig.png";
    wrapper.vm.form.identityUrl = "id.png";
    await nextTick();
    
    const downloadLinks = wrapper.findAll('button[download], a[download]');
    expect(downloadLinks.length).toBeGreaterThan(0);
  });

  it("submits and pushes new director when type is add", async () => {
    const wrapper = mount(DirectorForm, createConfig({ type: "add" }));
    await wrapper.find("form").trigger("submit.prevent");
    
    expect(mockFormData.directors.length).toBe(1);
    expect(mockFormData.directors[0].firstName).toBe("Jane");
    expect(mockOpen.value).toBe(false);
  });

  it("submits and updates existing director when type is edit", async () => {
    mockFormData.directors = [{ firstName: "Original" }];
    const wrapper = mount(DirectorForm, createConfig({ type: "edit", id: 0 }));
    await wrapper.find("form").trigger("submit.prevent");
    
    expect(mockFormData.directors[0].firstName).toBe("Jane");
    expect(mockOpen.value).toBe(false);
  });

  it("disables submit button if required files are missing", () => {
    const wrapper = mount(DirectorForm, createConfig({ type: "add" }));
    wrapper.vm.form.signatureUrl = "";
    wrapper.vm.form.identityUrl = "";
    
    const submitBtn = wrapper.find('button[type="submit"]');
    expect(submitBtn.element.disabled).toBe(true);
  });
});
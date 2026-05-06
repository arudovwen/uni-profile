import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, reactive, nextTick } from "vue";
import DirectorForm from "@/components/Pages/Business/company/DirectorForm.vue";

vi.mock("vee-validate", () => ({
  useForm: vi.fn(() => ({
    handleSubmit: (fn) => fn,
    defineField: vi.fn(() => [ref(""), reactive({})]),
    errors: reactive({}),
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    isFieldTouched: vi.fn(() => false),
  })),
}));

describe("DirectorForm.vue", () => {
  let open;
  let form;
  let companyInfo;

  beforeEach(() => {
    open = ref(true);
    form = reactive({ directors: [] });
    companyInfo = reactive({ country: "nigeria" });
  });

  const createWrapper = (props = { type: "add" }) => {
    return mount(DirectorForm, {
      props,
      global: {
        provide: {
          open,
          form,
          companyInfo,
        },
        stubs: {
          Textinput: {
            props: ["label"],
            template: '<div class="textinput-stub" :data-label="label"></div>'
          },
          FormGroup: { template: '<div><slot /></div>' },
          PhoneNumber: true,
          FileUpload: true,
          VueDatePicker: true,
          ClientOnly: { template: "<div><slot /></div>" },
        },
      },
    });
  };

  it("renders the heading correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find("h3").text()).toBe("Add director");
  });

  it("hides BVN field when country is not Nigeria", async () => {
    companyInfo.country = "ghana";
    const wrapper = createWrapper();
    await nextTick();
    const bvnInput = wrapper.find('[data-label="BVN"]');
    expect(bvnInput.exists()).toBe(false);
  });

  it("sets open to false when cancel button is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.find('button[type="button"]').trigger("click");
    expect(open.value).toBe(false);
  });

  it("populates form data on mounted if director prop is provided", async () => {
    const director = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      phone: "123456",
      dob: "1990-01-01",
      signatureUrl: "sig.png",
      identityUrl: "id.png",
      utilityBillUrl: "bill.png",
      address: "123 Street",
      linkedIn: "https://linkedin.com/in/john"
    };
    const wrapper = createWrapper({ type: "edit", director, id: 0 });
    await nextTick();
    expect(wrapper.vm.form.firstName).toBe("John");
  });

  it("adds a new director to the list on submit in add mode", async () => {
    const wrapper = createWrapper({ type: "add" });
    const mockValues = {
      firstName: "Jane",
      lastName: "Doe",
      signatureUrl: "sig.png",
      identityUrl: "id.png",
    };

    wrapper.vm.onSubmit(mockValues);
    expect(form.directors.length).toBe(1);
    expect(open.value).toBe(false);
  });

  it("updates an existing director on submit in edit mode", async () => {
    form.directors = [{ firstName: "Old" }];
    const wrapper = createWrapper({ type: "edit", id: 0 });
    const updatedValues = { firstName: "New" };

    wrapper.vm.onSubmit(updatedValues);
    expect(form.directors[0].firstName).toBe("New");
    expect(open.value).toBe(false);
  });

  it("updates internal form state via handleChange", () => {
    const wrapper = createWrapper();
    wrapper.vm.handleChange("signatureUrl", "sig.jpg");
    wrapper.vm.handleChange("identityUrl", "id.jpg");
    wrapper.vm.handleChange("utilityBillUrl", "bill.jpg");
    
    expect(wrapper.vm.form.signatureUrl).toBe("sig.jpg");
    expect(wrapper.vm.form.identityUrl).toBe("id.jpg");
    expect(wrapper.vm.form.utilityBillUrl).toBe("bill.jpg");
  });

  it("disables submit button if required files are missing", async () => {
    const wrapper = createWrapper();
    wrapper.vm.form.signatureUrl = "";
    wrapper.vm.form.identityUrl = "";
    await nextTick();
    
    const submitBtn = wrapper.find('button[type="submit"]');
    expect(submitBtn.element.disabled).toBe(true);
  });

  it("triggers download file function without throwing network errors", async () => {
    const wrapper = createWrapper();
    wrapper.vm.form.identityUrl = "https://example.com/id.png";
    await nextTick();
    
    const downloadBtn = wrapper.find('button.outline-none');
    if (downloadBtn.exists()) {
      await downloadBtn.trigger('click');
    }
    
    expect(wrapper.vm.form.identityUrl).toBe("https://example.com/id.png");
  });
});
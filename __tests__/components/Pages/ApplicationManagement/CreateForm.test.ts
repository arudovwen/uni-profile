import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "vue3-toastify";

vi.mock("vue3-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("~/services/userservices", () => ({
  addSubApp: vi.fn(),
  editSubApp: vi.fn(),
  getSubApp: vi.fn(),
}));

const mockNavigateTo = vi.fn();
vi.stubGlobal("navigateTo", mockNavigateTo);

const mockRouteParams: Record<string, any> = {};
vi.stubGlobal("useRoute", () => ({ params: mockRouteParams }));

import CreateForm from "@/components/Pages/ApplicationManagement/CreateForm.vue";
import * as userServices from "~/services/userservices";

const validFormData = {
  name: "New App",
  url: "https://newapp.com",
  description: "A new app",
  logoUrl: "https://logo.com/logo.png",
  iconUrl: "https://icon.com/icon.png",
  isTwoFactorAuthEnabled: true,
};

const existingAppData = {
  name: "Test App",
  url: "https://test.com",
  description: "A test app",
  logoUrl: "https://logo.com/logo.png",
  iconUrl: "https://icon.com/icon.png",
  isTwoFactorAuthEnabled: false,
  isDisabled: false,
};

describe("CreateForm", () => {
  const globalConfig = {
    stubs: {
      GoBack: { template: '<div class="go-back-stub" />' },
      HeaderComponent: { template: '<div class="header-stub" />' },
      FormGroupV2: {
        props: ["label", "subtext"],
        template: "<div><slot /></div>",
      },
      FormGroup: {
        props: ["label", "error", "name", "horizontal"],
        template: "<div><slot /></div>",
      },
      Textinput: {
        props: ["modelValue", "error", "isRequired"],
        template:
          '<input class="text-input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      },
      Textarea: {
        props: ["modelValue", "error", "isRequired"],
        template:
          '<textarea class="textarea-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      },
      FileUpload: {
        props: ["modelValue", "isRequired"],
        template: '<div class="file-upload-stub" />',
      },
      AppButton: {
        props: ["text", "isLoading", "isDisabled", "type", "btnClass"],
        emits: ["click"],
        template:
          '<button class="app-btn-stub" :data-text="text" :disabled="isDisabled" @click="$emit(\'click\')">{{ text }}</button>',
      },
      ActionModal: {
        props: ["open", "type", "title", "text", "btnText", "isCancel"],
        emits: ["actionItem", "close"],
        template:
          '<div v-if="open" class="action-modal-stub"><span class="modal-title">{{ title }}</span><button class="action-btn" @click="$emit(\'actionItem\')">Action</button><button class="close-btn" @click="$emit(\'close\')">Close</button></div>',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete mockRouteParams.id;
    vi.mocked(userServices.addSubApp).mockResolvedValue({ status: 200 } as any);
    vi.mocked(userServices.editSubApp).mockResolvedValue({ status: 200 } as any);
    vi.mocked(userServices.getSubApp).mockResolvedValue({
      status: 200,
      data: { data: existingAppData },
    } as any);
  });

  it("renders the form in create mode with no id", async () => {
    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();
    expect(userServices.getSubApp).not.toHaveBeenCalled();
    expect(wrapper.find("form").exists()).toBe(true);
  });
  
  it("does not populate form when getSubApp returns non-200", async () => {
    mockRouteParams.id = "app-123";
    vi.mocked(userServices.getSubApp).mockResolvedValueOnce({
      status: 404,
      data: {},
    } as any);
    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.name).toBe("");
  });

  it("calls addSubApp on submit in create mode and opens success modal", async () => {
    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(userServices.addSubApp).toHaveBeenCalled();
    expect(wrapper.vm.isSuccessOpen).toBe(true);
  });

  it("emits refresh after successful create", async () => {
    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(wrapper.emitted("refresh")).toBeTruthy();
  });

  it("sets isLoading to true during submission and false after", async () => {
    let resolveSubmit: any;
    vi.mocked(userServices.addSubApp).mockReturnValueOnce(
      new Promise((res) => { resolveSubmit = res; })
    );

    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    const submitPromise = wrapper.vm.onSubmit();
    await flushPromises();
    expect(wrapper.vm.isLoading).toBe(true);

    resolveSubmit({ status: 200 });
    await submitPromise;
    await flushPromises();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("shows error toast on API failure", async () => {
    vi.mocked(userServices.addSubApp).mockRejectedValueOnce({
      response: { data: { message: "Server error" } },
    });

    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith("Server error");
  });

  it("shows fallback error message when response message is absent", async () => {
    vi.mocked(userServices.addSubApp).mockRejectedValueOnce(new Error("Network fail"));

    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith("An error occurred");
  });

  it("sets isLoading to false after error", async () => {
    vi.mocked(userServices.addSubApp).mockRejectedValueOnce({
      response: { data: { message: "Fail" } },
    });

    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    Object.assign(wrapper.vm, validFormData);
    await wrapper.vm.onSubmit();
    await flushPromises();

    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("success modal title says Created in create mode", async () => {
    const wrapper = mount(CreateForm, { global: globalConfig });
    await flushPromises();

    wrapper.vm.isSuccessOpen = true;
    await flushPromises();

    expect(wrapper.find(".modal-title").text()).toBe("Application Created");
  });
});
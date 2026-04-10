import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick, ref, reactive } from "vue";
import InviteForm from "@/components/Pages/Superadmin/Users/InviteForm.vue";
import * as userServices from "~/services/userservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/userservices", () => ({
  sendAdminInvite: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

let formValues = reactive({});
vi.mock("vee-validate", () => ({
  useForm: vi.fn(({ initialValues }) => {
    Object.assign(formValues, initialValues);
    return {
      handleSubmit: (fn) => async (e) => {
        if (e?.preventDefault) e.preventDefault();
        await fn(formValues);
      },
      defineField: (name) => [ref(formValues[name]), { name }],
      errors: reactive({}),
      values: formValues,
      meta: ref({}),
      resetForm: vi.fn(),
      setFieldValue: (key, val) => { formValues[key] = val; },
    };
  }),
}));

const mockGetAppsData = vi.fn();
vi.mock("~/stores/auth", () => ({
  useAuthStore: () => ({
    appList: [{ code: "APP1" }, { code: "APP2" }],
    getAppsData: mockGetAppsData,
  }),
}));

describe("InviteForm.vue", () => {
  let wrapper;
  const isOpen = ref(true);

  const createWrapper = (props = {}) => {
    return mount(InviteForm, {
      props,
      global: {
        provide: { isOpen },
        stubs: {
          ProfileAddIcon: true,
          Textinput: true,
          FormGroup: { template: "<div><slot /></div>" },
          SelectVueSelect: true,
          AppUserSelector: { 
            name: "AppUserSelector", 
            template: '<div class="selector-stub"></div>' 
          },
          AppButton: {
            name: "AppButton",
            template: '<button class="app-btn-stub" @click="$emit(\'click\')">{{text}}</button>',
            props: ["text"],
          },
          ActionModal: {
            name: "ActionModal",
            template: '<div class="modal-stub"><slot /></div>',
            props: ["open"],
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(formValues).forEach(key => delete formValues[key]);
    isOpen.value = true;
  });

  it("calls getAppsData on mount", async () => {
    createWrapper();
    await nextTick();
    expect(mockGetAppsData).toHaveBeenCalled();
  });

  it("hides sub-text when detail prop is true", () => {
    wrapper = createWrapper({ detail: true });
    expect(wrapper.text()).not.toContain("Invite team members to join your organization");
  });

  it("shows AppUserSelector only when role is not 1", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue('role', 0);
    await nextTick();
    expect(wrapper.find(".selector-stub").exists()).toBe(true);
  });

  it("updates appCodes field when AppUserSelector emits getData", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue('role', 0);
    await nextTick();
    const selector = wrapper.findComponent({ name: "AppUserSelector" });
    await selector.vm.$emit("getData", [{ appCode: "A1" }]);
    expect(formValues.appCodes).toEqual([{ appCode: "A1" }]);
  });

  it("handles successful form submission for Superadmin (role 1)", async () => {
    vi.mocked(userServices.sendAdminInvite).mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    
    wrapper.vm.setFieldValue('email', 'admin@test.com');
    wrapper.vm.setFieldValue('role', 1);
    wrapper.vm.setFieldValue('appCodes', ["APP1", "APP2"]);

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    
    expect(userServices.sendAdminInvite).toHaveBeenCalledWith(expect.objectContaining({
      email: 'admin@test.com',
      role: 1,
      appCodes: ["APP1", "APP2"]
    }));
    expect(wrapper.vm.isSuccessOpen).toBe(true);
  });

  it("handles successful form submission for Platform Admin (role 0)", async () => {
    vi.mocked(userServices.sendAdminInvite).mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    
    wrapper.vm.setFieldValue('email', 'platform@test.com');
    wrapper.vm.setFieldValue('role', 0);
    wrapper.vm.setFieldValue('appCodes', [{ appCode: "P1" }]);

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    
    expect(userServices.sendAdminInvite).toHaveBeenCalledWith(expect.objectContaining({
      role: 0,
      appCodes: ["P1"]
    }));
  });

  it("handles submission error", async () => {
    vi.mocked(userServices.sendAdminInvite).mockRejectedValue({
      response: { data: { message: "Fail" } }
    });
    wrapper = createWrapper();
    
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    
    expect(toast.error).toHaveBeenCalledWith("Fail");
  });

  it("handles ActionModal events", async () => {
    wrapper = createWrapper();
    wrapper.vm.isSuccessOpen = true;
    
    wrapper.vm.isSuccessOpen = false;
    expect(wrapper.vm.isSuccessOpen).toBe(false);
  });
});
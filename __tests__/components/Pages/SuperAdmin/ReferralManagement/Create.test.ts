import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CreateReferral from "@/components/Pages/Superadmin/ReferralManagement/Create.vue";
import * as userservices from "~/services/userservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/userservices", () => ({
  generateReferralCode: vi.fn(),
  getSubApps: vi.fn(),
  createReferral: vi.fn(),
  updateReferral: vi.fn(),
  checkReferralCodeUniqueness: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn) => {
    fn.cancel = vi.fn();
    return fn;
  },
}));

vi.mock("@headlessui/vue", () => ({
  Combobox: { template: "<div><slot /></div>", props: ["modelValue"] },
  ComboboxInput: { template: "<input />" },
  ComboboxButton: { template: "<button><slot /></button>" },
  ComboboxOptions: { template: "<div><slot /></div>" },
  ComboboxOption: { template: "<div><slot :selected='true' :active='true' /></div>", props: ["value"] },
  TransitionRoot: { template: "<div><slot /></div>" },
}));

const mockRoute = { query: { refType: "0" } };
const mockNavigateTo = vi.fn();

vi.stubGlobal("useRoute", () => mockRoute);
vi.stubGlobal("navigateTo", mockNavigateTo);

describe("Create.vue", () => {
  let wrapper;

  const createWrapper = () => {
    return mount(CreateReferral, {
      global: {
        stubs: {
          ArrowLeft: { template: "<div />" },
          Textinput: {
            template: '<input :disabled="!!disabled" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ["modelValue", "error", "disabled"],
          },
          FormsDepartmentDropdown: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value="Sales">Sales</option></select>',
            props: ["modelValue"],
          },
          CustomSearchSelect: {
            template: '<div class="custom-search-stub" @click="$emit(\'option-selected\', {value: \'user123\', label: \'John Doe\', email: \'john@test.com\'})"></div>',
            props: ["modelValue"],
          },
          AppButton: {
            template: '<button :disabled="!!isDisabled" @click="$emit(\'click\')">{{text}}</button>',
            props: ["isDisabled", "text", "isLoading", "btnClass", "type"],
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query.refType = "0";
    userservices.generateReferralCode.mockResolvedValue({ data: { data: "REF123" } });
    userservices.getSubApps.mockResolvedValue({
      status: 200,
      data: { data: [{ name: "App1" }] },
    });
    userservices.checkReferralCodeUniqueness.mockResolvedValue(true);
  });

  it("initializes and loads apps and codes on mount", async () => {
    wrapper = createWrapper();
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));
    expect(userservices.generateReferralCode).toHaveBeenCalled();
    expect(wrapper.vm.referralCode).toBe("REF123");
  });

  it("updates state when user is selected", async () => {
    wrapper = createWrapper();
    await wrapper.find(".custom-search-stub").trigger("click");
    expect(wrapper.vm.assignedUser).toBe("user123");
  });

  it("manages assigned apps list", async () => {
    wrapper = createWrapper();
    wrapper.vm.assignedApps = ["App1"];
    expect(wrapper.vm.getAppName("App1")).toBe("App1");
    wrapper.vm.removeApp("App1");
    expect(wrapper.vm.assignedApps).toHaveLength(0);
  });

  it("validates uniqueness and updates error state", async () => {
    userservices.checkReferralCodeUniqueness.mockResolvedValue(false);
    wrapper = createWrapper();
    wrapper.vm.referralCode = "TAKEN";
    await nextTick();
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.vm.codeUniquenessError).toBeTruthy();
  });

  it("successfully creates a referral", async () => {
    userservices.createReferral.mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    wrapper.vm.codeIsUnique = true;

    wrapper.vm.setFieldValue("referralCode", "NEW123");
    wrapper.vm.setFieldValue("assignedUser", "u1");
    wrapper.vm.setFieldValue("assignedApps", ["App1"]);

    await wrapper.vm.onSubmit();
    expect(userservices.createReferral).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it("successfully updates an existing referral", async () => {
    userservices.updateReferral.mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    wrapper.vm.referralData = { id: 1 };
    wrapper.vm.codeIsUnique = true;

    wrapper.vm.setFieldValue("referralCode", "UPD123");
    wrapper.vm.setFieldValue("assignedUser", "u1");
    wrapper.vm.setFieldValue("assignedApps", ["App1"]);

    await wrapper.vm.onSubmit();
    expect(userservices.updateReferral).toHaveBeenCalled();
  });

  it("performs safety uniqueness check on submit if not yet checked", async () => {
    userservices.checkReferralCodeUniqueness.mockResolvedValue(true);
    userservices.createReferral.mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    wrapper.vm.codeIsUnique = false;

    wrapper.vm.setFieldValue("referralCode", "LATE");
    wrapper.vm.setFieldValue("assignedUser", "u1");
    wrapper.vm.setFieldValue("assignedApps", ["App1"]);

    await wrapper.vm.onSubmit();
    expect(userservices.checkReferralCodeUniqueness).toHaveBeenCalled();
  });

  it("blocks submission if code is taken on final check", async () => {
    userservices.checkReferralCodeUniqueness.mockResolvedValue(false);
    wrapper = createWrapper();
    wrapper.vm.codeIsUnique = false;

    wrapper.vm.setFieldValue("referralCode", "BAD");
    wrapper.vm.setFieldValue("assignedUser", "u1");
    wrapper.vm.setFieldValue("assignedApps", ["App1"]);

    await wrapper.vm.onSubmit();
    expect(toast.error).toHaveBeenCalled();
    expect(userservices.createReferral).not.toHaveBeenCalled();
  });

  it("logs error and shows toast on loadApps failure", async () => {
    userservices.getSubApps.mockRejectedValue({ response: { data: { message: "Fail" } } });
    wrapper = createWrapper();
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));
    expect(toast.error).toHaveBeenCalledWith("Fail");
  });

  it("logs error and shows toast on generateCode failure", async () => {
    userservices.generateReferralCode.mockRejectedValue({ response: { data: { message: "Fail" } } });
    wrapper = createWrapper();
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));
    expect(toast.error).toHaveBeenCalledWith("Fail");
  });
});
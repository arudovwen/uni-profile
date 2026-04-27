import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditReferral from "@/components/Pages/Superadmin/ReferralManagement/edit/[id].vue";
import * as userServices from "~/services/userservices";
import * as apiHelpers from "~/helpers/api_helpers";
import { toast } from "vue3-toastify";

vi.mock("vue3-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn: any) => { fn.cancel = vi.fn(); return fn; },
}));

vi.mock("~/services/userservices", async (importOriginal) => {
  const actual = await importOriginal<typeof userServices>();
  return {
    ...actual,
    getSubApps: vi.fn(),
    getReferrals: vi.fn(),
    checkReferralCodeUniqueness: vi.fn(),
    getDepartments: vi.fn().mockResolvedValue({ status: 200, data: { data: [] } }),
  };
});

vi.mock("~/helpers/api_helpers", () => ({
  ssoPost: vi.fn(),
}));

// FIX: Mock the entire @headlessui/vue module so the real TransitionRoot
// (which throws when :show is missing) and Combobox (which crashes on
// reactive updates with null emitsOptions) are never loaded at all.
vi.mock("@headlessui/vue", () => ({
  Combobox: {
    name: "Combobox",
    props: ["modelValue", "multiple"],
    emits: ["update:modelValue"],
    template: '<div class="combobox-stub"><slot /></div>',
  },
  ComboboxInput: {
    name: "ComboboxInput",
    template: '<input class="combo-input-stub" @change="$emit(\'change\', $event)" />',
  },
  ComboboxButton: {
    name: "ComboboxButton",
    template: "<button><slot /></button>",
  },
  ComboboxOptions: {
    name: "ComboboxOptions",
    template: "<ul><slot /></ul>",
  },
  ComboboxOption: {
    name: "ComboboxOption",
    props: ["value"],
    template: "<li><slot :selected='false' :active='false' /></li>",
  },
  TransitionRoot: {
    name: "TransitionRoot",
    template: "<div><slot /></div>",
  },
  TransitionChild: {
    name: "TransitionChild",
    template: "<div><slot /></div>",
  },
}));

const mockNavigateTo = vi.fn();
vi.stubGlobal("navigateTo", mockNavigateTo);
vi.stubGlobal("useRoute", () => ({ params: { id: "REF123" } }));

const mockReferral = {
  id: 1,
  referralCode: "REF123",
  assignedUserId: "user1",
  assignedUser: "User One",
  assignedUserEmail: "u1@test.com",
  assignedDepartment: "HR",
  assignedApps: "App1,App2",
  referalType: 0,
};

describe("Edit Referral Component Coverage", () => {
  const globalConfig = {
    stubs: {
      ArrowLeft: {
        template: '<div class="arrow-left-stub" />',
      },
      Textinput: {
        props: ["modelValue", "error", "disabled"],
        template:
          '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" class="text-input-stub" />',
      },
      CustomSearchSelect: {
        props: ["modelValue"],
        template: '<div class="search-select-stub" />',
      },
      FormsDepartmentDropdown: {
        props: ["modelValue", "label", "name", "error"],
        template: '<div class="dept-dropdown-stub" />',
      },
      DepartmentDropdown: {
        props: ["modelValue", "label", "name", "error"],
        template: '<div class="dept-dropdown-stub" />',
      },
      AppButton: {
        props: ["text", "isLoading", "isDisabled", "type"],
        template:
          '<button class="app-btn-stub" :disabled="isDisabled" @click="$emit(\'click\')">{{ text }}</button>',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(userServices.getSubApps).mockResolvedValue({
      status: 200,
      data: { data: [{ name: "App1" }, { name: "App2" }] },
    } as any);

    vi.mocked(userServices.getReferrals).mockResolvedValue({
      status: 200,
      data: { data: [mockReferral] },
    } as any);

    vi.mocked(userServices.checkReferralCodeUniqueness).mockResolvedValue(true);
    vi.mocked(apiHelpers.ssoPost).mockResolvedValue({ status: 200 } as any);
  });

  it("renders different fields based on referralType 2", async () => {
    vi.mocked(userServices.getReferrals).mockResolvedValueOnce({
      status: 200,
      data: {
        data: [{
          id: 2,
          referalType: 2,
          referralCode: "CAMPAIGN",
          assignedUserId: "cmp1",
          assignedUser: "Campaign One",
          assignedUserEmail: "cmp@test.com",
          assignedDepartment: "",
          assignedApps: "",
        }],
      },
    } as any);
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    // FIX: Check referralData on vm directly rather than rendered text,
    // since the label lives in a <label> that may not appear in .text()
    // when stubs collapse the tree.
    expect(wrapper.vm.referralData.referalType).toBe(2);
    // Also verify the template branch renders by checking the DOM
    expect(wrapper.html()).toContain("Campaign Name");
  });

  it("handles app removal", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.assignedApps).toContain("App1");
    wrapper.vm.removeApp("App1");
    await flushPromises();
    expect(wrapper.vm.assignedApps).not.toContain("App1");
  });

  it("updates user selection via handleUserSelected", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    wrapper.vm.handleUserSelected({
      value: "user123",
      label: "New User",
      email: "new@test.com",
    });
    await flushPromises();
    expect(wrapper.vm.assignedUser).toBe("user123");
  });

  it("handles app search input", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    wrapper.vm.handleAppSearch({ target: { value: "test" } });
    expect(wrapper.vm.appSearchQuery).toBe("test");
  });

  it("submits the form successfully", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    wrapper.vm.codeIsUnique = true;
    await wrapper.vm.onSubmit();
    await flushPromises();
    expect(apiHelpers.ssoPost).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Referral updated successfully");
  });

  it("handles uniqueness check failure during submission", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    // FIX: Set the state that the submission code actually checks.
    // The branch fires when codeIsUnique=false AND codeUniquenessError is empty,
    // causing it to re-check and get false back.
    vi.mocked(userServices.checkReferralCodeUniqueness).mockResolvedValueOnce(false);
    wrapper.vm.codeIsUnique = false;
    wrapper.vm.codeUniquenessError = "";
    await wrapper.vm.onSubmit();
    await flushPromises();
    expect(toast.error).toHaveBeenCalledWith(
      "Referral code already exists. Please use a different code."
    );
  });

  it("returns raw appId if getAppName find fails", async () => {
    const wrapper = mount(EditReferral, { global: globalConfig });
    await flushPromises();
    expect(wrapper.vm.getAppName("UnknownApp")).toBe("UnknownApp");
  });

  it("handles uniqueness check error branch", async () => {
    vi.mocked(userServices.checkReferralCodeUniqueness).mockRejectedValueOnce(
      new Error("Network Error")
    );
    const wrapper = mount(EditReferral, { global: globalConfig });
    await wrapper.vm.validateCodeUniqueness("ABC");
    expect(wrapper.vm.codeUniquenessError).toBe(
      "Error validating code. Please try again."
    );
  });
});
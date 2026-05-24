import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ref, reactive, nextTick } from "vue";
import Directors from "@/components/Pages/Business/company/Directors.vue";
import { updateCompanyProfile } from "~/services/settingservices";
import { toast } from "vue3-toastify";

vi.mock("@/components/Pages/Business/company/DirectorForm.vue", () => ({
  default: {
    name: "PagesBusinessCompanyDirectorForm",
    template: "<div id=\"director-form-stub\"></div>",
    props: ["type", "director", "id"]
  }
}));

vi.mock("@/components/Pages/Business/company/DeleteModal.vue", () => ({
  default: {
    name: "PagesBusinessCompanyDeleteModal",
    template: "<div id=\"delete-modal-stub\"><button @click=\"$emit('delete')\" id=\"confirm-del-btn\"></button></div>"
  }
}));

vi.mock("~/services/settingservices", () => ({
  updateCompanyProfile: vi.fn(),
  updateBusinessProfile: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUpdateUserInfo = vi.fn();
vi.mock("@/stores/auth", () => ({
  useAuthStore: vi.fn(() => ({
    userInfo: { userCategory: 1 },
    updateUserInfo: mockUpdateUserInfo,
  })),
}));

vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({})),
}));

vi.mock("#app", () => ({
  useEncryptedCookie: vi.fn(() => ref({})),
}));

describe("Directors.vue", () => {
  let companyInfo;
  let form;
  let active;

  beforeEach(() => {
    vi.clearAllMocks();
    companyInfo = reactive({ approvalStatus: false });
    form = reactive({
      directors: [],
      companyDocuments: [{ urls: [{ url: "test.com" }] }],
    });
    active = ref(1);
  });

  const createWrapper = () => {
    return mount(Directors, {
      global: {
        provide: {
          companyInfo,
          form,
          active,
        },
        stubs: {
          DirectorsView: true,
          AppButton: {
            props: ["text", "disabled"],
            template: '<button class="app-button-stub" :disabled="disabled" @click="$emit(\'click\')">{{text}}</button>',
          },
          TransitionRoot: { template: "<div><slot /></div>" },
          TransitionChild: { template: "<div><slot /></div>" },
          Dialog: { template: "<div><slot /></div>" },
          DialogPanel: { template: "<div><slot /></div>" },
          PagesBusinessCompanyDirectorForm: true,
          PagesBusinessCompanyDeleteModal: true,
        },
      },
    });
  };

  it("opens add modal when clicking add director button", async () => {
    const wrapper = createWrapper();
    await nextTick();
    await wrapper.find("button.appearance-none").trigger("click");
    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.action).toBe("add");
  });

  it("handles handleDelete event from DirectorsView", async () => {
    const wrapper = createWrapper();
    await nextTick();
    wrapper.findComponent({ name: "DirectorsView" }).vm.$emit("handleDelete", 5);
    expect(wrapper.vm.id).toBe(5);
    expect(wrapper.vm.action).toBe("delete");
    expect(wrapper.vm.open).toBe(true);
  });

  it("handles handleEdit event from DirectorsView", async () => {
    const wrapper = createWrapper();
    await nextTick();
    const mockDirector = { name: "John" };
    wrapper.findComponent({ name: "DirectorsView" }).vm.$emit("handleEdit", 1, mockDirector);
    expect(wrapper.vm.id).toBe(1);
    expect(wrapper.vm.director).toStrictEqual(mockDirector);
    expect(wrapper.vm.action).toBe("edit");
    expect(wrapper.vm.open).toBe(true);
  });

  it("removes director and closes modal when onDelete is triggered", async () => {
    form.directors = ["dir1", "dir2", "dir3"];
    const wrapper = createWrapper();
    await nextTick();
    wrapper.vm.id = 1;
    wrapper.vm.onDelete();
    expect(form.directors).toStrictEqual(["dir1", "dir3"]);
    expect(wrapper.vm.open).toBe(false);
  });

  it("returns early in handleSubmit if no directors exist", async () => {
    const wrapper = createWrapper();
    await nextTick();
    await wrapper.vm.handleSubmit();
    expect(updateCompanyProfile).not.toHaveBeenCalled();
  });

  it("calls updateCompanyProfile and handles success", async () => {
    form.directors = [{ name: "John" }];
    updateCompanyProfile.mockResolvedValue({ status: 200 });
    const wrapper = createWrapper();
    await nextTick();
    
    await wrapper.vm.handleSubmit();
    await flushPromises();
    
    expect(updateCompanyProfile).toHaveBeenCalled();
    expect(mockUpdateUserInfo).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Information saved");
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("handles error in updateCompanyProfile", async () => {
    form.directors = [{ name: "John" }];
    const errorMsg = "Failed to save";
    updateCompanyProfile.mockRejectedValue({
      response: { data: { message: errorMsg } }
    });
    const wrapper = createWrapper();
    await nextTick();
    
    await wrapper.vm.handleSubmit();
    await flushPromises();
    
    expect(toast.error).toHaveBeenCalledWith(errorMsg);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("handles alternative error object structure", async () => {
    form.directors = [{ name: "John" }];
    updateCompanyProfile.mockRejectedValue({
      response: { data: { Message: "Alternative Error" } }
    });
    const wrapper = createWrapper();
    await nextTick();
    
    await wrapper.vm.handleSubmit();
    await flushPromises();
    
    expect(toast.error).toHaveBeenCalledWith("Alternative Error");
  });
});
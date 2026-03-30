import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import CreateDriverForm from "@/components/CreateDriverForm.vue";

vi.mock("~/services/driverservices", () => ({
  addDriver: vi.fn(),
  updateDriver: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("vee-validate", () => ({
  useForm: vi.fn(),
}));

const mockRouter = { push: vi.fn() };
vi.stubGlobal("useRouter", () => mockRouter);

const baseFormReturn = () => {
  const fields: Record<string, ReturnType<typeof ref>> = {
    email: ref(""),
    firstName: ref(""),
    lastName: ref(""),
    phoneNumber: ref(""),
    nin: ref(""),
    driversLicenseNumber: ref(""),
  };

  return {
    handleSubmit: vi.fn((cb) => () => cb({
      email: "test@test.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "08011111111",
      nin: "12345678901",
      driversLicenseNumber: "ABC123",
      driverDocuments: [
        { url: "http://file1.com", urls: ["http://file1.com"], documentType: 0 },
        { url: "http://file2.com", urls: ["http://file2.com"], documentType: 1 },
      ],
    })),
    defineField: vi.fn((name: string) => [fields[name] ?? ref(""), {}]),
    errors: ref({}),
    values: {
      driverDocuments: [
        { url: "http://file1.com", urls: [], documentType: 0 },
        { url: "http://file2.com", urls: [], documentType: 1 },
      ],
    },
    meta: ref({ valid: true }),
    resetForm: vi.fn(),
    setFieldValue: vi.fn(),
  };
};

const baseStubs = {
  Textinput: { template: "<input />", props: ["modelValue", "error", "label", "placeholder", "type", "name", "iconType", "iconPosition", "isRequired"] },
  LazyPhoneNumber: { template: "<input />", props: ["modelValue", "error", "label", "placeholder", "type", "name"] },
  DropFile: { template: "<div />", props: ["label", "id", "value"], emits: ["file-selected", "file-removed"] },
  AppButton: { template: '<button @click="$emit(\'click\')"><slot /></button>', props: ["btnClass", "type", "isLoading", "text", "isDisabled"], emits: ["click"] },
  ProfileAddIcon: { template: "<span />" },
  SMSTracking: { template: "<span />" },
};

const mountForm = (driverData = ref(null), isOpen = ref(true)) => {
  const { useForm } = require("vee-validate");
  const formReturn = baseFormReturn();
  useForm.mockReturnValue(formReturn);

  const wrapper = mount(CreateDriverForm, {
    global: {
      stubs: baseStubs,
      provide: {
        driverData,
        isOpen,
      },
    },
  });

  return { wrapper, formReturn, isOpen, driverData };
};

describe("CreateDriverForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial render", () => {
    it("renders the add driver form by default", () => {
      const { wrapper } = mountForm();
      expect(wrapper.text()).toContain("Add New Driver");
    });

    it("renders update driver title when driverData has id", () => {
      const driverData = ref({ id: "123", firstName: "Jane" });
      const { wrapper } = mountForm(driverData);
      expect(wrapper.text()).toContain("Update Driver");
    });

    it("does not show success screen initially", () => {
      const { wrapper } = mountForm();
      expect(wrapper.text()).not.toContain("Account Created");
    });
  });

  describe("success screen", () => {
    it("shows account created on success for new driver", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { wrapper } = mountForm();
      await wrapper.vm.onSubmit();
      await nextTick();

      expect(wrapper.text()).toContain("Account Created");
    });

    it("shows account updated text on success for existing driver", async () => {
      const { updateDriver } = await import("~/services/driverservices");
      (updateDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const driverData = ref({ id: "123" });
      const { wrapper } = mountForm(driverData);
      await wrapper.vm.onSubmit();
      await nextTick();

      expect(wrapper.text()).toContain("Account Updated");
    });

    it("clicking Done closes modal and emits refresh", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const isOpen = ref(true);
      const { wrapper } = mountForm(ref(null), isOpen);
      await wrapper.vm.onSubmit();
      await nextTick();

      const buttons = wrapper.findAll("button");
      const doneBtn = buttons.find((b) => b.text() === "Done");
      await doneBtn!.trigger("click");

      expect(isOpen.value).toBe(false);
    });

    it("clicking Add New Driver resets form and goes back to step 2", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { wrapper, formReturn } = mountForm();
      await wrapper.vm.onSubmit();
      await nextTick();

      const buttons = wrapper.findAll("button");
      const addNewBtn = buttons.find((b) => b.text() === "Add New Driver");
      await addNewBtn!.trigger("click");

      expect(formReturn.resetForm).toHaveBeenCalled();
      expect(wrapper.text()).not.toContain("Account Created");
    });
  });

  describe("form submission", () => {
    it("calls addDriver with form values for new driver", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { wrapper } = mountForm();
      await wrapper.vm.onSubmit();

      expect(addDriver).toHaveBeenCalled();
    });

    it("calls updateDriver with form values for existing driver", async () => {
      const { updateDriver } = await import("~/services/driverservices");
      (updateDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const driverData = ref({ id: "456" });
      const { wrapper } = mountForm(driverData);
      await wrapper.vm.onSubmit();

      expect(updateDriver).toHaveBeenCalledWith(expect.any(Object), "456");
    });

    it("shows error toast when documents are missing", async () => {
      const { useForm } = require("vee-validate");
      const formReturn = baseFormReturn();
      formReturn.values.driverDocuments = [
        { url: null, urls: [], documentType: 0 },
        { url: null, urls: [], documentType: 1 },
      ];
      formReturn.handleSubmit = vi.fn((cb) => () => cb({
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "08011111111",
        nin: "12345678901",
        driversLicenseNumber: "ABC123",
        driverDocuments: [
          { url: null, urls: [], documentType: 0 },
          { url: null, urls: [], documentType: 1 },
        ],
      }));
      useForm.mockReturnValue(formReturn);

      const wrapper = mount(CreateDriverForm, {
        global: { stubs: baseStubs, provide: { driverData: ref(null), isOpen: ref(true) } },
      });

      await wrapper.vm.onSubmit();

      const { toast } = await import("vue3-toastify");
      expect(toast.error).toHaveBeenCalledWith("Upload required files");
    });

    it("shows error toast when addDriver fails", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: { message: "Server error" } },
      });

      const { wrapper } = mountForm();
      await wrapper.vm.onSubmit();
      await nextTick();

      const { toast } = await import("vue3-toastify");
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });

    it("shows error toast when updateDriver fails", async () => {
      const { updateDriver } = await import("~/services/driverservices");
      (updateDriver as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: { message: "Update failed" } },
      });

      const driverData = ref({ id: "789" });
      const { wrapper } = mountForm(driverData);
      await wrapper.vm.onSubmit();
      await nextTick();

      const { toast } = await import("vue3-toastify");
      expect(toast.error).toHaveBeenCalledWith("Update failed");
    });

    it("sets isLoading to false after addDriver resolves", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { wrapper } = mountForm();
      await wrapper.vm.onSubmit();
      await nextTick();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("sets isLoading to false after addDriver rejects", async () => {
      const { addDriver } = await import("~/services/driverservices");
      (addDriver as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: { message: "err" } },
      });

      const { wrapper } = mountForm();
      await wrapper.vm.onSubmit();
      await nextTick();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("file handling", () => {
    it("handleFileSelection updates driverDocuments via setFieldValue", async () => {
      const { wrapper, formReturn } = mountForm();

      wrapper.vm.handleFileSelection("http://newfile.com", 0);

      expect(formReturn.setFieldValue).toHaveBeenCalledWith(
        "driverDocuments",
        expect.arrayContaining([
          expect.objectContaining({ url: "http://newfile.com", documentType: 0 }),
        ])
      );
    });

    it("handleFileSelection updates second document slot", async () => {
      const { wrapper, formReturn } = mountForm();

      wrapper.vm.handleFileSelection("http://lasdri.com", 1);

      expect(formReturn.setFieldValue).toHaveBeenCalledWith(
        "driverDocuments",
        expect.arrayContaining([
          expect.objectContaining({ url: "http://lasdri.com", documentType: 1 }),
        ])
      );
    });

    it("DropFile file-selected event calls handleFileSelection", async () => {
      const { wrapper, formReturn } = mountForm();
      const dropFiles = wrapper.findAllComponents({ name: "DropFile" });

      await dropFiles[0].vm.$emit("file-selected", "http://triggered.com", 0);

      expect(formReturn.setFieldValue).toHaveBeenCalled();
    });

    it("DropFile file-removed event calls handleFileRemoval without error", async () => {
      const { wrapper } = mountForm();
      const dropFile = wrapper.findAllComponents({ name: "DropFile" })[0];
      await expect(dropFile.vm.$emit("file-removed")).resolves.not.toThrow();
    });
  });

  describe("cancel button", () => {
    it("clicking Cancel sets isOpen to false", async () => {
      const isOpen = ref(true);
      const { wrapper } = mountForm(ref(null), isOpen);

      const buttons = wrapper.findAll("button");
      const cancelBtn = buttons.find((b) => b.text() === "Cancel");
      await cancelBtn!.trigger("click");

      expect(isOpen.value).toBe(false);
    });
  });

  describe("checkDocumentsUrls", () => {
    it("returns false when documents array is null", () => {
      const { wrapper } = mountForm();
      expect(wrapper.vm.checkDocumentsUrls(null)).toBe(false);
    });

    it("returns false when documents array is not an array", () => {
      const { wrapper } = mountForm();
      expect(wrapper.vm.checkDocumentsUrls("invalid")).toBe(false);
    });

    it("returns false when a document has empty url string", () => {
      const { wrapper } = mountForm();
      expect(
        wrapper.vm.checkDocumentsUrls([
          { url: "  ", documentType: 0 },
          { url: "http://file.com", documentType: 1 },
        ])
      ).toBe(false);
    });

    it("returns true when all documents have valid urls", () => {
      const { wrapper } = mountForm();
      expect(
        wrapper.vm.checkDocumentsUrls([
          { url: "http://file1.com", documentType: 0 },
          { url: "http://file2.com", documentType: 1 },
        ])
      ).toBe(true);
    });
  });
});
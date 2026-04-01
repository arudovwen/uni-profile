import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DropFile from "@/components/DropFile.vue";
import { toast } from "vue3-toastify";
import { uploadfile } from "~/services/onboardingservice";

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("~/services/onboardingservice", () => ({
  uploadfile: vi.fn(),
}));

describe("DropFile.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mocking global variables that appear to be missing in the component script
    global.images = { value: [] };
    global.documents = { value: [] };
  });

  const globalConfig = {
    stubs: { AppIcon: true },
  };

  it("renders label and icon when provided", () => {
    const wrapper = mount(DropFile, {
      props: { label: "Upload Document" },
      global: globalConfig,
    });
    expect(wrapper.find("label").text()).toContain("Upload Document");
  });

  it("renders upload state when value is null", () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    expect(wrapper.text()).toContain("Click to upload");
  });

  it("renders file info when value is present", () => {
    const wrapper = mount(DropFile, {
      props: { value: "test-file.pdf" },
      global: globalConfig,
    });
    expect(wrapper.text()).toContain("test-file.pdf");
  });

  it("triggers file input click when main div is clicked and no value exists", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    const input = wrapper.find('input[type="file"]').element;
    const spy = vi.spyOn(input, "click");
    const dropzone = wrapper.find(".border-\\[1px\\]");
    await dropzone.trigger("click");
    expect(spy).toHaveBeenCalled();
  });

  it("emits file-selected with null when delete icon is clicked", async () => {
    const wrapper = mount(DropFile, {
      props: { value: "file.pdf", id: "doc_1" },
      global: globalConfig,
    });
    await wrapper.find("svg.absolute").trigger("click");
    expect(wrapper.emitted("file-selected")[0]).toEqual([null, "doc_1"]);
  });

  it("handles drag events and updates isDragging state", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    const dropzone = wrapper.find(".border-\\[1px\\]");
    await dropzone.trigger("dragover");
    expect(wrapper.vm.isDragging).toBe(true);
    await dropzone.trigger("dragleave");
    expect(wrapper.vm.isDragging).toBe(false);
  });

  it("shows error for invalid file format", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    const file = new File([""], "test.txt", { type: "text/plain" });
    wrapper.vm.handleFile(file);
    expect(toast.error).toHaveBeenCalledWith("Invalid format");
  });

  it("shows error for oversized file", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    const largeFile = new File(["".padStart(900 * 1024, "0")], "large.pdf", { type: "application/pdf" });
    wrapper.vm.handleFile(largeFile);
    expect(toast.error).toHaveBeenCalledWith("File size exceeds the limit (800 KB).");
  });

  it("successfully uploads an image and emits events", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null, id: "img_1", type: "image" },
      global: globalConfig,
    });
    
    const file = new File(["content"], "test.png", { type: "image/png" });
    uploadfile.mockResolvedValue({ data: { message: "https://cdn.url/test.png" } });

    wrapper.vm.handleFile(file);

    await vi.waitFor(() => {
      if (!wrapper.emitted("file-selected")) throw new Error("Not emitted");
      expect(wrapper.emitted("file-selected")[0]).toEqual(["https://cdn.url/test.png", "img_1"]);
    }, { timeout: 2000 });

    expect(wrapper.emitted("update:value")[0]).toEqual([file]);
  });

  it("successfully uploads a document and emits events", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null, id: "doc_1", type: "doc" },
      global: globalConfig,
    });
    
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    uploadfile.mockResolvedValue({ data: { message: "https://cdn.url/test.pdf" } });

    wrapper.vm.handleFile(file);

    await vi.waitFor(() => {
      if (!wrapper.emitted("file-selected")) throw new Error("Not emitted");
      expect(wrapper.emitted("file-selected")[0]).toEqual(["https://cdn.url/test.pdf", "doc_1"]);
    });

    expect(uploadfile).toHaveBeenCalledWith(expect.objectContaining({ ext: ".pdf" }));
  });

  it("handles upload error and shows toast", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null, id: "doc_1" },
      global: globalConfig,
    });
    
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    uploadfile.mockRejectedValue({ response: { data: { message: "Server Error" } } });

    wrapper.vm.handleFile(file);
    
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server Error");
    });
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("watches for external value changes", async () => {
    const wrapper = mount(DropFile, {
      props: { value: "old.pdf" },
      global: globalConfig,
    });
    await wrapper.setProps({ value: "new.pdf" });
    expect(wrapper.vm.selectedFile).toBe("new.pdf");
  });

  it("handles file selection via input change", async () => {
    const wrapper = mount(DropFile, {
      props: { value: null },
      global: globalConfig,
    });
    const file = new File(["content"], "input.pdf", { type: "application/pdf" });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger("change");
    expect(wrapper.vm.selectedFile).toEqual(file);
  });
});
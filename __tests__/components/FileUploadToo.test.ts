import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import FileUploadToo from "@/components/FileUploadToo.vue";
import { toast } from "vue3-toastify";
import { uploaddocument } from "~/services/onboardingservice";

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("~/services/onboardingservice", () => ({
  uploaddocument: vi.fn(),
}));

describe("FileUploadToo.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const globalConfig = {
    stubs: {
      FileLoader: true,
      SvgsUploadSvg: { template: '<div class="svg-stub"></div>' },
    },
  };

  it("shows loader when loading state is true", async () => {
    const wrapper = mount(FileUploadToo, { global: globalConfig });
    wrapper.vm.loading = true;
    await nextTick();
    expect(wrapper.findComponent({ name: "FileLoader" }).exists()).toBe(true);
  });

  it("handles single file upload successfully", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { multiple: false, accept: "pdf, png" },
      global: globalConfig,
    });
    
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const mockResponse = { data: { data: "https://url.com/test.pdf" } };
    uploaddocument.mockResolvedValue(mockResponse);

    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file] });
    
    await input.trigger("change");

    await vi.waitFor(() => {
      expect(uploaddocument).toHaveBeenCalled();
      expect(wrapper.emitted("update:modelValue")[0]).toEqual(["https://url.com/test.pdf"]);
    });
  });

  it("handles multiple file uploads successfully", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { multiple: true, accept: "pdf,png" },
      global: globalConfig,
    });

    const file1 = new File(["1"], "1.pdf", { type: "application/pdf" });
    const file2 = new File(["2"], "2.png", { type: "image/png" });
    
    uploaddocument
      .mockResolvedValueOnce({ data: { message: "url1" } })
      .mockResolvedValueOnce({ data: { message: "url2" } });

    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file1, file2] });
    
    await input.trigger("change");

    await vi.waitFor(() => {
      const emissions = wrapper.emitted("update:modelValue");
      expect(emissions[emissions.length - 1]).toEqual([["url1", "url2"]]);
    }, { timeout: 3000 });
  });

  it("errors on invalid file extension in single mode", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { accept: "pdf" },
      global: globalConfig,
    });
    const file = new File([""], "test.jpg", { type: "image/jpeg" });
    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file] });
    
    await input.trigger("change");
    expect(toast.error).toHaveBeenCalledWith("Invalid file type. Please upload a document.");
  });

  it("errors on invalid file extension in multiple mode", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { multiple: true, accept: "pdf" },
      global: globalConfig,
    });
    const file = new File([""], "test.jpg", { type: "image/jpeg" });
    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file] });
    
    await input.trigger("change");
    expect(toast.error).toHaveBeenCalledWith("Invalid file type. Please upload a document.");
  });

  it("handles upload rejection in single mode", async () => {
    const wrapper = mount(FileUploadToo, { global: globalConfig });
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    uploaddocument.mockRejectedValue(new Error("Upload Failed"));

    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    await vi.waitFor(() => {
      expect(wrapper.vm.loading).toBe(false);
    });
  });

  it("handles upload rejection in multiple mode", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { multiple: true },
      global: globalConfig,
    });
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    uploaddocument.mockRejectedValue(new Error("Multi Upload Failed"));

    const input = wrapper.find("input");
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    await vi.waitFor(() => {
      expect(wrapper.vm.loading).toBe(false);
    });
  });

  it("triggers file input via triggerFileInput method", () => {
    const wrapper = mount(FileUploadToo, { global: globalConfig });
    const spy = vi.spyOn(wrapper.vm.fileInputRef, "click");
    wrapper.vm.triggerFileInput();
    expect(spy).toHaveBeenCalled();
  });

  it("returns early if no files selected", async () => {
    const wrapper = mount(FileUploadToo, { global: globalConfig });
    const input = wrapper.find("input");
    
    Object.defineProperty(input.element, "files", { value: [] });
    await input.trigger("change");
    expect(uploaddocument).not.toHaveBeenCalled();

    await wrapper.setProps({ multiple: true });
    await input.trigger("change");
    expect(uploaddocument).not.toHaveBeenCalled();
  });

  it("updates title when modelValue changes", async () => {
    const wrapper = mount(FileUploadToo, {
      props: { modelValue: "initial.pdf" },
      global: globalConfig,
    });
    expect(wrapper.vm.title).toBe("initial.pdf");
    
    await wrapper.setProps({ modelValue: "updated.pdf" });
    expect(wrapper.vm.title).toBe("updated.pdf");
  });
});
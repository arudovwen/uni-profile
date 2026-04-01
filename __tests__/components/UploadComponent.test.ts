import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import UploadComponent from "@/components/UploadComponent.vue";
import * as onboardingService from "@/services/onboardingservice.js";
import { toast } from "vue3-toastify";

vi.mock("@/services/onboardingservice.js", () => ({
  uploadfile: vi.fn(),
  uploaddocument: vi.fn()
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() }
}));

describe("UploadComponent.vue", () => {
  const globalConfig = {
    stubs: { AppIcon: true }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.stubGlobal('FileReader', vi.fn().mockImplementation(() => ({
      readAsDataURL: function() {
        this.result = "data:image/png;base64,foo";
        setTimeout(() => this.onloadend(), 0);
      },
      result: null,
      onloadend: null
    })));
  });

  it("renders correctly with default props", () => {
    const wrapper = mount(UploadComponent, {
      props: { support: "SVG", recommended: "800x400" },
      global: globalConfig
    });
    expect(wrapper.text()).toContain("SVG");
  });

  it("shows preview image when not multiple and url exists", () => {
    const wrapper = mount(UploadComponent, {
      props: { isMultiple: false, url: "test.jpg" },
      global: globalConfig
    });
    expect(wrapper.find("img[alt='upload']").exists()).toBe(true);
  });

  it("computes correct accept attribute", async () => {
    const wrapper = mount(UploadComponent, {
      props: { type: "image" },
      global: globalConfig
    });
    expect(wrapper.find('input[type="file"]').attributes("accept")).toBe(".png, .jpg, .jpeg");
    await wrapper.setProps({ type: "doc" });
    expect(wrapper.find('input[type="file"]').attributes("accept")).toBe(".pdf");
  });

  it("handles file upload successfully for images", async () => {
    vi.mocked(onboardingService.uploadfile).mockResolvedValue({ data: { message: "img-url" } });
    const wrapper = mount(UploadComponent, {
      props: { type: "image" },
      global: globalConfig
    });

    const file = new File([""], "test.png", { type: "image/png" });
    Object.defineProperty(file, 'size', { value: 100 });

    const input = wrapper.find('input[data-testid="upload"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    
    await input.trigger("change");
    await vi.waitFor(() => expect(onboardingService.uploadfile).toHaveBeenCalled());
    expect(wrapper.emitted("onGetFiles")).toBeTruthy();
  });

  it("handles file upload successfully for documents", async () => {
    vi.mocked(onboardingService.uploaddocument).mockResolvedValue({ data: { message: "doc-url" } });
    const wrapper = mount(UploadComponent, {
      props: { type: "doc" },
      global: globalConfig
    });

    const file = new File([""], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(file, 'size', { value: 100 });

    const input = wrapper.find('input[data-testid="upload"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    
    await input.trigger("change");
    await vi.waitFor(() => expect(onboardingService.uploaddocument).toHaveBeenCalled());
    expect(wrapper.emitted("onGetFiles")).toBeTruthy();
  });

  it("shows error toast if file size exceeds limit", async () => {
    const wrapper = mount(UploadComponent, { global: globalConfig });
    const largeFile = new File([""], "large.png");
    Object.defineProperty(largeFile, 'size', { value: 900 * 1024 });

    const input = wrapper.find('input[data-testid="upload"]');
    Object.defineProperty(input.element, 'files', { value: [largeFile] });
    
    await input.trigger("change");
    expect(toast.error).toHaveBeenCalled();
  });

  it("handles onDrop event", async () => {
    const wrapper = mount(UploadComponent, { global: globalConfig });
    const file = new File([""], "drop.png");
    
    await wrapper.find("label").trigger("drop", {
      dataTransfer: { files: [file] }
    });

    await vi.waitFor(() => expect(wrapper.emitted("onGetFiles")).toBeTruthy());
  });

  it("removes file from gallery and emits event", async () => {
    const wrapper = mount(UploadComponent, {
      props: { 
        isMultiple: true, 
        type: "image", 
        gallery: ["img1.jpg"] 
      },
      global: globalConfig
    });

    const removeBtn = wrapper.find("span.h-24 span.bg-white");
    expect(removeBtn.exists()).toBe(true);
    
    await removeBtn.trigger("click");
    expect(wrapper.emitted("removeFile")).toBeTruthy();
    expect(wrapper.emitted("removeFile")[0]).toEqual([0]);
  });

  it("adds event listeners to body on mount", () => {
    const addSpy = vi.spyOn(document.body, "addEventListener");
    mount(UploadComponent, { global: globalConfig });
    expect(addSpy).toHaveBeenCalledWith("dragover", expect.any(Function));
  });

  it("shows loading spinner when isLoading is true", async () => {
    const wrapper = mount(UploadComponent, { global: globalConfig });
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".fa-spinner").exists()).toBe(true);
  });
});
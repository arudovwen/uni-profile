import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

vi.mock("@tinymce/tinymce-vue", () => ({
  default: {
    name: "Editor",
    template: '<div class="editor-stub"><slot /></div>',
    props: ["modelValue", "init", "apiKey", "placeholder"],
  },
}));

import TextEditor from "@/components/TextEditor.vue";
import MockEditor from "@tinymce/tinymce-vue";

describe("TextEditor.vue", () => {
  beforeEach(() => {
    vi.stubEnv("VUE_APP_TINYMCE_KEY", "test-key");
    vi.stubEnv("VUE_APP_URL", "https://api.test.com/");
  });

  const getInit = (wrapper) =>
    wrapper.findComponent(MockEditor).props("init");

  it("renders with initial props and env variables", () => {
    const wrapper = mount(TextEditor, {
      props: {
        modelValue: "Hello",
        placeholder: "Test Placeholder",
        id: "editor-id",
      },
    });

    const editor = wrapper.findComponent(MockEditor);
    expect(editor.exists()).toBe(true);
    expect(editor.props("apiKey")).toBe("test-key");
    expect(editor.props("placeholder")).toBe("Test Placeholder");
    expect(editor.props("init").selector).toBe("editor-id");
  });

  it("updates internal value when modelValue prop changes", async () => {
    const wrapper = mount(TextEditor, {
      props: { modelValue: "Initial" },
    });

    await wrapper.setProps({ modelValue: "Updated" });
    expect(wrapper.vm.value).toBe("Updated");
  });

  it("emits update:modelValue on keyup", async () => {
    const wrapper = mount(TextEditor, {
      props: { modelValue: "" },
    });

    wrapper.vm.value = "New Content";
    await wrapper.findComponent(MockEditor).trigger("keyup");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["New Content"]);
  });

  describe("handleFile (XMLHttpRequest)", () => {
    let xhrMock;

    beforeEach(() => {
      xhrMock = {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        upload: {},
        withCredentials: false,
        status: 200,
        responseText: "",
      };
      vi.stubGlobal("XMLHttpRequest", vi.fn(() => xhrMock));
    });

    it("resolves on successful upload", async () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);
      const blobInfo = { base64: () => "base64string" };

      const promise = init.images_upload_handler(blobInfo, vi.fn());

      xhrMock.status = 200;
      xhrMock.responseText = JSON.stringify({ message: "https://image.url" });
      xhrMock.onload();

      const result = await promise;
      expect(result).toBe("https://image.url");
      expect(xhrMock.open).toHaveBeenCalledWith(
        "POST",
        "https://api.test.com/v1/fileservice/uploadsinglephoto"
      );
    });

    it("rejects on 403 status", async () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);

      const promise = init.images_upload_handler({ base64: () => "" }, vi.fn());
      xhrMock.status = 403;
      xhrMock.onload();

      await expect(promise).rejects.toEqual({
        message: "HTTP Error: 403",
        remove: true,
      });
    });

    it("rejects on generic error status", async () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);

      const promise = init.images_upload_handler({ base64: () => "" }, vi.fn());
      xhrMock.status = 500;
      xhrMock.onload();

      await expect(promise).rejects.toBe("HTTP Error: 500");
    });

    it("rejects on network error", async () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);

      const promise = init.images_upload_handler({ base64: () => "" }, vi.fn());
      xhrMock.onerror();

      await expect(promise).rejects.toContain("XHR Transport error");
    });

    it("rejects on invalid JSON response", async () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);

      const promise = init.images_upload_handler({ base64: () => "" }, vi.fn());
      xhrMock.status = 200;
      xhrMock.responseText = JSON.stringify({ data: "no message here" });
      xhrMock.onload();

      await expect(promise).rejects.toContain("Invalid JSON");
    });

    it("updates progress during upload", () => {
      const wrapper = mount(TextEditor);
      const init = getInit(wrapper);
      const progressSpy = vi.fn();

      init.images_upload_handler({ base64: () => "" }, progressSpy);

      xhrMock.upload.onprogress({ loaded: 50, total: 100 });
      expect(progressSpy).toHaveBeenCalledWith(50);
    });
  });
});
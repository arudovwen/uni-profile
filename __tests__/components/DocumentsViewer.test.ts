import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DocumentsViewer from "@/components/DocumentsViewer.vue";

describe("DocumentsViewer", () => {
  const documents = [
    {
      documentType: 1,
      urls: [
        { url: "https://example.com/file1.pdf" },
        { url: "https://example.com/file2.png" }
      ],
    },
  ];

  const globalConfig = {
    stubs: {
      MediaViewer: {
        name: "MediaViewer",
        template: '<div id="media-viewer-stub"></div>',
        props: ["media", "open"]
      },
      AppIcon: true,
    },
  };

  it("does not render if documents array is empty", () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents: [], type: "user" },
      global: globalConfig,
    });
    expect(wrapper.find("table").exists()).toBe(false);
  });

  it("opens MediaViewer when view button is clicked", async () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents, type: "user" },
      global: globalConfig,
    });

    const viewButtons = wrapper.findAll('button[type="button"]');
    await viewButtons[0].trigger("click");
    await nextTick();

    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    expect(viewer.exists()).toBe(true);
    expect(viewer.props("media")).toBe(documents[0].urls[0].url);
  });

  it("emits deleteDoc event with correct payload", async () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents, type: "user", hideUpdate: false },
      global: globalConfig,
    });

    const deleteButton = wrapper.find('button.text-red-500');
    await deleteButton.trigger("click");

    expect(wrapper.emitted("deleteDoc")).toBeTruthy();
    expect(wrapper.emitted("deleteDoc")[0][0]).toEqual({
      url: documents[0].urls[0].url,
      type: documents[0].documentType,
    });
  });

  it("hites delete button when hideUpdate is true", () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents, type: "user", hideUpdate: true },
      global: globalConfig,
    });

    expect(wrapper.find('button.text-red-500').exists()).toBe(false);
  });

  it("closes MediaViewer when close event is emitted", async () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents, type: "user" },
      global: globalConfig,
    });

    await wrapper.find('button[type="button"]').trigger("click");
    await nextTick();

    const viewer = wrapper.findComponent({ name: "MediaViewer" });
    await viewer.vm.$emit("close");
    await nextTick();

    expect(wrapper.findComponent({ name: "MediaViewer" }).exists()).toBe(false);
  });

  it("verifies flattenedObjects computed property logic", () => {
    const wrapper = mount(DocumentsViewer, {
      props: { documents, type: "user" },
      global: globalConfig,
    });

    const vm = wrapper.vm as any;
    const expected = [
      { url: "https://example.com/file1.pdf", documentType: 1 },
      { url: "https://example.com/file2.png", documentType: 1 }
    ];
    expect(vm.flattenedObjects).toEqual(expected);
  });
});
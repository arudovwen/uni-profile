import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DirectorsView from "@/components/DirectorsView.vue";

describe("DirectorsView.vue", () => {
  const IndexModalStub = {
    name: "IndexModal",
    template: '<div><slot name="content" /></div>',
    props: ["isOpen"]
  };

  const MediaViewerStub = {
    name: "MediaViewer",
    template: '<div v-if="open" class="media-viewer"></div>',
    props: ["open", "media"]
  };

  const EmptyDataStub = {
    name: "EmptyData",
    template: '<div class="empty-data"></div>',
    props: ["type", "title"]
  };

  const DirectorViewStub = {
    name: "DirectorView",
    template: '<div class="director-view"></div>',
    props: ["detail"]
  };

  const globalConfig = {
    stubs: {
      IndexModal: IndexModalStub,
      MediaViewer: MediaViewerStub,
      EmptyData: EmptyDataStub,
      DirectorView: DirectorViewStub,
      AppIcon: true
    }
  };

  const mockDirectors = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    }
  ];

  it("renders empty state when no directors provided", () => {
    const wrapper = mount(DirectorsView, {
      props: { directors: [] },
      global: globalConfig
    });
    expect(wrapper.findComponent(EmptyDataStub).exists()).toBe(true);
  });

  it("renders director details correctly", () => {
    const wrapper = mount(DirectorsView, {
      props: { directors: mockDirectors },
      global: globalConfig
    });
    expect(wrapper.text()).toContain("JD");
    expect(wrapper.text()).toContain("John Doe");
  });

  it("shows edit and delete buttons when approvalStatus is false", async () => {
    const wrapper = mount(DirectorsView, {
      props: { 
        directors: mockDirectors,
        companyInfo: { approvalStatus: false }
      },
      global: globalConfig
    });

    const editBtn = wrapper.find(".uil-pen").element.closest('span');
    const deleteBtn = wrapper.find(".uil-trash").element.closest('span');

    await editBtn.click();
    expect(wrapper.emitted("handleEdit")).toBeTruthy();

    await deleteBtn.click();
    expect(wrapper.emitted("handleDelete")).toBeTruthy();
  });

  it("shows view button and opens modal when approvalStatus is true", async () => {
    const wrapper = mount(DirectorsView, {
      props: { 
        directors: mockDirectors,
        companyInfo: { approvalStatus: true }
      },
      global: globalConfig
    });

    const viewBtn = wrapper.find("button");
    await viewBtn.trigger("click");

    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.detail).toEqual(mockDirectors[0]);
  });

  it("closes modal when toggle-popup is emitted", async () => {
    const wrapper = mount(DirectorsView, {
      props: { directors: mockDirectors },
      global: globalConfig
    });

    wrapper.vm.open = true;
    await wrapper.vm.$nextTick();

    const modal = wrapper.findComponent(IndexModalStub);
    await modal.vm.$emit("toggle-popup");

    expect(wrapper.vm.open).toBe(false);
  });

  it("handles media viewer visibility", async () => {
    const wrapper = mount(DirectorsView, {
      props: { directors: mockDirectors },
      global: globalConfig
    });

    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    const viewer = wrapper.findComponent(MediaViewerStub);
    await viewer.vm.$emit("close");
    expect(wrapper.vm.isOpen).toBe(false);
  });
});
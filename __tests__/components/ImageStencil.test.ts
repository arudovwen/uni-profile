import { it, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ImageStencil from "@/components/ImageStencil.vue";
import { ResizeEvent } from "vue-advanced-cropper";

describe("ImageStencil.vue", () => {
  const defaultProps = {
    image: { src: "test.jpg" },
    coordinates: { width: 100, height: 100, left: 0, top: 0 },
    stencilCoordinates: { width: 200, height: 200, left: 10, top: 10 },
    transitions: { enabled: false }
  };

  const globalConfig = {
    stubs: {
      DraggableElement: { template: "<div><slot /></div>" },
      DraggableArea: { template: "<div><slot /></div>" },
      StencilPreview: true,
    },
  };

  it("renders with correct basic styles", () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    const style = wrapper.find(".circle-stencil").attributes("style");
    expect(style).toContain("width: 200px");
    expect(style).toContain("height: 200px");
    expect(style).toContain("transform: translate(10px, 10px)");
  });

  it("applies transitions when enabled", () => {
    const wrapper = mount(ImageStencil, {
      props: {
        ...defaultProps,
        transitions: { enabled: true, time: 300, timingFunction: "ease" },
      },
      global: globalConfig,
    });
    const style = wrapper.find(".circle-stencil").attributes("style");
    expect(style).toContain("transition: 300ms ease");
  });

  it("emits move events", async () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    wrapper.vm.onMove({ x: 5, y: 5 });
    expect(wrapper.emitted("move")[0]).toEqual([{ x: 5, y: 5 }]);
    
    wrapper.vm.onMoveEnd();
    expect(wrapper.emitted("move-end")).toBeTruthy();
  });

  it("handles resizing and emits ResizeEvent", () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    
    const mockDragEvent = {
      shift: () => ({ left: 10, top: -20 })
    };

    wrapper.vm.onResize(mockDragEvent);
    
    const resizeEmitted = wrapper.emitted("resize")[0][0];
    expect(resizeEmitted).toBeInstanceOf(ResizeEvent);
    
    // ResizeEvent usually stores directions/params separately
    // Check the directions object directly
    expect(resizeEmitted.directions).toEqual({
      left: 10,
      right: 10,
      top: 20,
      bottom: 20,
    });
    
    expect(resizeEmitted.params).toEqual({
      compensate: true,
    });
  });

  it("emits resize-end", () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    wrapper.vm.onResizeEnd();
    expect(wrapper.emitted("resize-end")).toBeTruthy();
  });

  it("returns correct aspect ratios", () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    expect(wrapper.vm.aspectRatios()).toEqual({
      minimum: 1,
      maximum: 1,
    });
  });

  it("prevents default on mousedown of the icon", async () => {
    const wrapper = mount(ImageStencil, {
      props: defaultProps,
      global: globalConfig,
    });
    const svg = wrapper.find(".circle-stencil__icon");
    const event = { preventDefault: vi.fn() };
    await svg.trigger("mousedown", event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("computes style without transitions correctly", () => {
    const wrapper = mount(ImageStencil, {
      props: {
        ...defaultProps,
        transitions: null
      },
      global: globalConfig,
    });
    expect(wrapper.vm.style.transition).toBeUndefined();
  });
});
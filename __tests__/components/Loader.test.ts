import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import Loader from "@/components/Loader.vue";

describe("Loader.vue", () => {
  const IndexModalStub = {
    name: "IndexModal",
    template: `
      <div v-if="isOpen" class="modal-stub">
        <slot name="content" />
        <button id="close-btn" @click="$emit('togglePopup')">Close</button>
      </div>
    `,
    props: ["isOpen", "canClose"]
  };

  const globalConfig = {
    stubs: {
      IndexModal: IndexModalStub
    }
  };

  it("does not render when isLoaderOpen is false", () => {
    const wrapper = mount(Loader, {
      props: { isLoaderOpen: false, text: "Loading..." },
      global: globalConfig
    });
    expect(wrapper.find(".modal-stub").exists()).toBe(false);
  });

  it("renders with correct text when isLoaderOpen is true", () => {
    const wrapper = mount(Loader, {
      props: { isLoaderOpen: true, text: "Fetching data..." },
      global: globalConfig
    });
    expect(wrapper.find(".modal-stub").exists()).toBe(true);
    expect(wrapper.text()).toContain("Fetching data...");
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
  });

  it("emits closeLoader when IndexModal triggers togglePopup", async () => {
    const wrapper = mount(Loader, {
      props: { isLoaderOpen: true, text: "Loading" },
      global: {
        ...globalConfig,
        mocks: {
          emit: (event) => wrapper.vm.$emit(event)
        }
      }
    });
    
    const modal = wrapper.findComponent({ name: "IndexModal" });
    await modal.vm.$emit("togglePopup");
    
    expect(wrapper.emitted("closeLoader")).toBeTruthy();
  });

  it("passes correct props to IndexModal", () => {
    const wrapper = mount(Loader, {
      props: { isLoaderOpen: true, text: "Loading" },
      global: globalConfig
    });
    
    const modal = wrapper.findComponent({ name: "IndexModal" });
    expect(modal.props("isOpen")).toBe(true);
    expect(modal.props("canClose")).toBe(false);
  });
});
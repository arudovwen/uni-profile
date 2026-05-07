import { it, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import AppLoader from "@/components/AppLoader.vue";

describe("AppLoader", () => {
  it("renders the loader container and spinner successfully", () => {
    const wrapper = mount(AppLoader);
    
    expect(wrapper.find(".loader-container").exists()).toBe(true);
    expect(wrapper.find(".loader").exists()).toBe(true);
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
  });
});
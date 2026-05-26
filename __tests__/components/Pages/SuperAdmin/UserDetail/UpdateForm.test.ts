import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UpdateForm from "@/components/Pages/Superadmin/UserDetail/UpdateForm.vue";

vi.mock("virtual:public?%2Fimages%2Fenable-user.svg", () => ({ default: "mock-enable-user.svg" }));
vi.mock("virtual:public?%2Fimages%2Frevoke-user.svg", () => ({ default: "mock-revoke-user.svg" }));
vi.mock("@/assets/images/svgs/profile-add.svg", () => ({ default: "mock-profile-add.svg" }));

describe("UpdateForm", () => {
  const globalConfig = {
    stubs: {
      FormGroup: { template: '<div><slot /></div>' },
      "form-group": { template: '<div><slot /></div>' },
      
      SelectVueSelect: {
        props: ["modelValue", "options"],
        template: `
          <select 
            id="mock-role-select"
            :value="modelValue" 
            @change="$emit('update:modelValue', $event.target.value)"
          >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        `
      },
      "select-vue-select": {
        props: ["modelValue", "options"],
        template: '<select id="mock-role-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"></select>'
      },

      AppButton: {
        props: ["text", "isLoading", "isDisabled", "type"],
        template: `
          <button 
            class="mock-button"
            :type="type" 
            :disabled="isDisabled || isLoading"
            @click="$emit('click')"
          >
            {{ text }}
          </button>
        `
      },
      "app-button": {
        props: ["text", "isLoading", "isDisabled", "type"],
        template: '<button class="mock-button" @click="$emit(\'click\')">{{text}}</button>'
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial values", () => {
    const wrapper = mount(UpdateForm, {
      props: { detail: { id: 1 } },
      global: globalConfig
    });
    expect(wrapper.find("h4").text()).toBe("Update User Role");
    expect(wrapper.vm.role).toBe("superadmin");
  });

  it("emits close when cancel button is clicked", async () => {
    const wrapper = mount(UpdateForm, {
      props: { detail: { id: 1 } },
      global: globalConfig
    });
    
    const buttons = wrapper.findAll("button");
    const cancelBtn = buttons.find(b => b.text().toLowerCase().includes("cancel"));
    
    if (!cancelBtn) {
      const appButtons = wrapper.findAllComponents({ name: 'AppButton' });
      const fallbackBtn = appButtons.find(b => b.props('text')?.toLowerCase().includes('cancel'));
      await fallbackBtn.trigger('click');
    } else {
      await cancelBtn.trigger("click");
    }
    
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("triggers onSubmit when form is submitted", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const wrapper = mount(UpdateForm, {
      props: { detail: { id: 1 } },
      global: globalConfig
    });

    await wrapper.find("form").trigger("submit");
    
    await flushPromises();
    await new Promise(resolve => setTimeout(resolve, 50));
    await flushPromises();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("onSubmit"),
      expect.objectContaining({ role: "superadmin" })
    );
  });
});
import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref, reactive } from "vue";
import LoanRequest from "@/components/Pages/Financing/LoanRequest.vue";

describe("LoanRequest.vue", () => {
  let wrapper;
  const active = ref(1);
  const formData = reactive({
    amountRequired: null,
    tenor: "",
    whereDidYouHearAboutUs: "",
  });

  const createWrapper = () => {
    return mount(LoanRequest, {
      global: {
        stubs: {
          FormGroup: true,
          CurrencyInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          Select: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="o in options" :value="o.value">{{o.label}}</option></select>',
            props: ['modelValue', 'options']
          },
          Textinput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          AppButton: {
            template: '<button :disabled="disabled">{{text}}</button>',
            props: ['disabled', 'text']
          }
        },
        provide: {
          active,
          formData,
        },
      },
    });
  };

  beforeEach(() => {
    active.value = 1;
    formData.amountRequired = null;
    formData.tenor = "";
    formData.whereDidYouHearAboutUs = "";
  });

  it("renders initial state and reactive injections", async () => {
    formData.amountRequired = 500;
    wrapper = createWrapper();
    await nextTick();
    expect(wrapper.vm.amountRequired).toBe(500);
  });

  it("validates required fields and shows errors", async () => {
    wrapper = createWrapper();
    await wrapper.find("form").trigger("submit");
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(wrapper.vm.errors.amountRequired).toBeDefined();
    expect(wrapper.vm.errors.tenor).toBeDefined();
  });

  it("validates minimum amount requirement", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("amountRequired", 50);
    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(wrapper.vm.errors.amountRequired).toBe("Minimum amount is 100 naira");
  });

  it("successfully submits form and updates injected state", async () => {
    wrapper = createWrapper();
    
    wrapper.vm.setFieldValue("amountRequired", 5000);
    wrapper.vm.setFieldValue("tenor", "30");
    wrapper.vm.setFieldValue("whereDidYouHearAboutUs", "Twitter");
    
    await nextTick();
    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(formData.amountRequired).toBe(5000);
    expect(formData.tenor).toBe("30");
    expect(formData.whereDidYouHearAboutUs).toBe("Twitter");
    expect(active.value).toBe(2);
  });

  it("computes options correctly", () => {
    wrapper = createWrapper();
    const options = wrapper.vm.options;
    expect(options).toHaveLength(4);
    expect(options[0]).toEqual({ label: "7 days", value: 7 });
  });

  it("handles non-numeric amount values gracefully", async () => {
    wrapper = createWrapper();
    wrapper.vm.setFieldValue("amountRequired", "abc");
    await wrapper.find("form").trigger("submit");
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(wrapper.vm.errors.amountRequired).toBe("invalid value");
  });
});
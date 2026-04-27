import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick, ref } from "vue";
import SettlementForm from "@/components/Pages/Settlements/Form.vue";
import * as settlementService from "~/services/settlementservice";
import { toast } from "vue3-toastify";

vi.mock("~/services/settlementservice", () => ({
  addSettlement: vi.fn(),
  updateSettlement: vi.fn(),
  getBanks: vi.fn(),
  validateAccount: vi.fn(() => Promise.resolve({ data: { data: { responseBody: {} } } })),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

describe("SettlementForm.vue", () => {
  let wrapper;
  const mockIsOpen = ref(true);
  const mockHandleSuccess = vi.fn();

  const banksResponse = {
    status: 200,
    data: { data: { responseBody: [{ name: "Test Bank", code: "001" }] } },
  };

  const createWrapper = (props = {}) => {
    return mount(SettlementForm, {
      props,
      global: {
        provide: {
          isOpen: mockIsOpen,
          handleSuccess: mockHandleSuccess,
        },
        stubs: {
          FormGroup: true,
          SelectVueSelect: true,
          Textinput: {
            template: '<input class="input-stub" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ["modelValue"],
          },
          Checkbox: true,
          AppButton: {
            template: '<button class="app-btn-stub" :disabled="isDisabled">{{ text }}</button>',
            props: ["text", "isDisabled"],
          },
          ActionModal: {
            template: '<div class="modal-stub"><button class="action-btn" @click="$emit(\'actionItem\')"></button><button class="close-btn" @click="$emit(\'close\')"></button></div>',
            props: ["open"],
          },
          FileLoader: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    settlementService.getBanks.mockResolvedValue(banksResponse);
    settlementService.validateAccount.mockResolvedValue({ data: { data: { responseBody: { accountName: "John Doe" } } } });
    mockIsOpen.value = true;
  });

  it("renders Add legend when no detail prop", async () => {
    wrapper = createWrapper();
    await flushPromises();
    expect(wrapper.find("legend").text()).toContain("Add Settlement Account");
  });

  it("renders Update legend and sets values when detail exists", async () => {
    const detail = { id: 1, bankName: "Test Bank", accountNumber: "1234567890", isPrimaryAccount: true };
    wrapper = createWrapper({ detail });
    await flushPromises();
    expect(wrapper.find("legend").text()).toContain("Update Settlement Account");
  });

  it("validates account when bank and 10-digit account number exist", async () => {
    wrapper = createWrapper();
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await flushPromises();
    expect(settlementService.validateAccount).toHaveBeenCalled();
  });

  it("shows toast on account validation error", async () => {
    settlementService.validateAccount.mockRejectedValue(new Error("Fail"));
    wrapper = createWrapper();
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await flushPromises();
    expect(toast.error).toHaveBeenCalledWith("Invalid account number");
  });

  it("submits addSettlement successfully", async () => {
    settlementService.addSettlement.mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(settlementService.addSettlement).toHaveBeenCalled();
    expect(mockIsOpen.value).toBe(false);
  });

  it("submits updateSettlement successfully", async () => {
    settlementService.updateSettlement.mockResolvedValue({ status: 200 });
    wrapper = createWrapper({ detail: { id: 1 } });
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(settlementService.updateSettlement).toHaveBeenCalled();
  });

  it("handles submission error", async () => {
    settlementService.addSettlement.mockRejectedValue({
      response: { data: { message: "Failed" } },
    });
    wrapper = createWrapper();
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.vm.isErrorOpen).toBe(true);
    expect(wrapper.vm.errorText).toBe("Failed");
  });

  it("handles success modal close triggers handleSuccess", async () => {
    wrapper = createWrapper();
    wrapper.vm.isSuccessOpen = true;
    await nextTick();
    const successModal = wrapper.findAll(".modal-stub")[0];
    await successModal.find(".close-btn").trigger("click");
    expect(mockHandleSuccess).toHaveBeenCalled();
  });

  it("handles error modal close triggers isOpen false", async () => {
    wrapper = createWrapper();
    wrapper.vm.isErrorOpen = true;
    await nextTick();
    const errorModal = wrapper.findAll(".modal-stub")[1];
    await errorModal.find(".close-btn").trigger("click");
    expect(mockIsOpen.value).toBe(false);
  });

  it("handles bank mapping and fallback error text", async () => {
    settlementService.addSettlement.mockRejectedValue({});
    wrapper = createWrapper({ detail: { bankName: "Test Bank" } });
    await flushPromises();
    wrapper.vm.bankCode = "001";
    wrapper.vm.accountNumber = "1234567890";
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.vm.errorText).toBe("Settlement creation failed");
  });
});
import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CustomSearchSelect from "@/components/CustomSearchSelect.vue";

const { mockGetAllUsers, mockGetCentralAdminUsers, mockAuthStore } = vi.hoisted(() => ({
  mockGetAllUsers: vi.fn(),
  mockGetCentralAdminUsers: vi.fn(),
  mockAuthStore: { userInfo: { userCategory: 0 } },
}));

vi.mock("~/services/userservices", () => ({
  getAllUsers: mockGetAllUsers,
  getCentralAdminUsers: mockGetCentralAdminUsers,
}));

vi.mock("@headlessui/vue", () => ({
  Combobox: {
    template: '<div><slot /></div>',
    props: ["modelValue"],
    emits: ["update:modelValue"],
  },
  ComboboxInput: {
    template: '<input @change="$emit(\'change\', $event)" :placeholder="placeholder" />',
    props: ["displayValue", "placeholder"],
    emits: ["change"],
  },
  ComboboxButton: { template: "<button><slot /></button>" },
  ComboboxOptions: { template: "<ul><slot /></ul>" },
  ComboboxOption: {
    template: '<li><slot :selected="false" :active="false" /></li>',
    props: ["value"],
  },
  TransitionRoot: { template: "<div><slot /></div>" },
}));

// Mock the store module so GetUsersMapper captures the mock at init time
vi.mock("~/stores/auth", () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.stubGlobal("useAuthStore", () => mockAuthStore);

const mockUsersResponse = {
  status: 200,
  data: {
    data: [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com" },
      { id: "2", firstName: "Jane", lastName: "Smith", contactEmail: "jane@example.com" },
    ],
  },
};

const mountComponent = (props = {}, userCategory = 0) => {
  mockAuthStore.userInfo.userCategory = userCategory;
  return mount(CustomSearchSelect, {
    props: {
      apiEndpoint: "/users",
      initialOptions: [],
      modelValue: null,
      minSearchLength: 2,
      placeholder: "Search name...",
      ...props,
    },
  });
};

describe("CustomSearchSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockAuthStore.userInfo.userCategory = 0;
    mockGetAllUsers.mockResolvedValue(mockUsersResponse);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial render", () => {
    it("renders the combobox input", () => {
      const wrapper = mountComponent();
      expect(wrapper.find("input").exists()).toBe(true);
    });

    it("renders with custom placeholder", () => {
      const wrapper = mountComponent({ placeholder: "Find user..." });
      expect(wrapper.find("input").attributes("placeholder")).toBe("Find user...");
    });

    it("calls fetchSearchResults on mount", async () => {
      mountComponent();
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalled();
    });

    it("uses getAllUsers for userCategory 0", async () => {
      mountComponent({}, 0);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalled();
    });

    it("uses getAllUsers for userCategory 3", async () => {
      mountComponent({}, 3);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalled();
    });

    it("uses getAllUsers for userCategory 4", async () => {
      mountComponent({}, 4);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalled();
    });

    it("passes userCategories filter for userCategory 3", async () => {
      mountComponent({}, 3);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalledWith(
        expect.objectContaining({ userCategories: [0, 1, 2, 3] })
      );
    });

    it("passes null userCategories for userCategory 0", async () => {
      mountComponent({}, 0);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalledWith(
        expect.objectContaining({ userCategories: null })
      );
    });
  });

  describe("fetchSearchResults", () => {
    it("clears filteredOptions and sets isLoading false on error", async () => {
      mockGetAllUsers.mockRejectedValue(new Error("Network error"));
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      expect(wrapper.vm.filteredOptions).toEqual([]);
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("sets isLoading to false after successful fetch", async () => {
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("clears filteredOptions when response status is not 200", async () => {
      mockGetAllUsers.mockResolvedValue({ status: 500, data: { data: [] } });
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      expect(wrapper.vm.filteredOptions).toEqual([]);
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("handleSearch", () => {
    it("sets showOptions to true on input change", async () => {
      const wrapper = mountComponent();
      const input = wrapper.find("input");
      input.element.value = "jo";
      await input.trigger("change");
      expect(wrapper.vm.showOptions).toBe(true);
    });

    it("does not call fetchSearchResults immediately when query is long enough", async () => {
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      mockGetAllUsers.mockClear();

      const input = wrapper.find("input");
      input.element.value = "john";
      await input.trigger("change");
      expect(mockGetAllUsers).not.toHaveBeenCalled();
    });

    it("calls fetchSearchResults after 300ms debounce", async () => {
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      mockGetAllUsers.mockClear();

      const input = wrapper.find("input");
      input.element.value = "john";
      await input.trigger("change");
      vi.advanceTimersByTime(300);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalledWith(
        expect.objectContaining({ Search: "john" })
      );
    });

    it("clears previous timeout when typing again", async () => {
      const wrapper = mountComponent();
      await nextTick();
      await nextTick();
      mockGetAllUsers.mockClear();

      const input = wrapper.find("input");
      input.element.value = "jo";
      await input.trigger("change");
      input.element.value = "joh";
      await input.trigger("change");
      vi.advanceTimersByTime(300);
      await nextTick();
      await nextTick();
      expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("modelValue watcher", () => {
    it("sets selectedOption when modelValue prop is provided", async () => {
      const option = { label: "John Doe", value: "1" };
      const wrapper = mountComponent({ modelValue: option });
      await nextTick();
      expect(wrapper.vm.selectedOption).toEqual(option);
    });

    it("updates selectedOption when modelValue prop changes", async () => {
      const wrapper = mountComponent({ modelValue: null });
      const newVal = { label: "Jane Smith", value: "2" };
      await wrapper.setProps({ modelValue: newVal });
      await nextTick();
      expect(wrapper.vm.selectedOption).toEqual(newVal);
    });

    it("does not update selectedOption when modelValue becomes null", async () => {
      const option = { label: "John Doe", value: "1" };
      const wrapper = mountComponent({ modelValue: option });
      await nextTick();
      await wrapper.setProps({ modelValue: null });
      await nextTick();
      expect(wrapper.vm.selectedOption).toEqual(option);
    });
  });

  describe("selectedOption watcher", () => {
    it("emits update:modelValue when selectedOption changes", async () => {
      const wrapper = mountComponent();
      wrapper.vm.selectedOption = { label: "John Doe", value: "1" };
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["1"]);
    });

    it("emits option-selected with full option object", async () => {
      const wrapper = mountComponent();
      const option = { label: "John Doe", value: "1", email: "john@example.com" };
      wrapper.vm.selectedOption = option;
      await nextTick();
      expect(wrapper.emitted("option-selected")).toBeTruthy();
      expect(wrapper.emitted("option-selected")![0]).toEqual([option]);
    });
  });

  describe("template rendering", () => {
    it("shows loading text when isLoading is true and showOptions is true", async () => {
      mockGetAllUsers.mockImplementation(() => new Promise(() => {}));
      const wrapper = mountComponent();
      wrapper.vm.showOptions = true;
      wrapper.vm.isLoading = true;
      await nextTick();
      expect(wrapper.text()).toContain("Loading...");
    });

    it("shows no results text when filteredOptions is empty and not loading", async () => {
      mockGetAllUsers.mockResolvedValue({ status: 200, data: { data: [] } });
      const wrapper = mountComponent();
      wrapper.vm.showOptions = true;
      await nextTick();
      await nextTick();
      expect(wrapper.text()).toContain("No results found.");
    });

    it("does not render ComboboxOptions when showOptions is false", async () => {
      const wrapper = mountComponent();
      wrapper.vm.showOptions = false;
      await nextTick();
      expect(wrapper.find("ul").exists()).toBe(false);
    });
  });
});
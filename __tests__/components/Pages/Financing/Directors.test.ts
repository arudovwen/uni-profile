import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref, reactive } from "vue";
import Directors from "@/components/Pages/Financing/Directors.vue";
import * as settingservices from "~/services/settingservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/settingservices", () => ({
  updateDirectors: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.stubGlobal("useRoute", () => ({
  params: { id: "123" },
}));

describe("Directors.vue", () => {
  let wrapper;
  let active;
  let company;
  let getCompanyData;

  const createWrapper = () => {
    return mount(Directors, {
      global: {
        provide: {
          active: active,
          company: company,
          getCompanyData: getCompanyData,
        },
        stubs: {
          AppButton: {
            props: ["disabled", "isLoading", "text"],
            template: '<button :disabled="disabled" class="app-button-stub">{{ text }}</button>',
          },
          DirectorsView: true,
          DirectorForm: true,
          DeleteModal: true,
          TransitionRoot: { template: "<div><slot /></div>" },
          TransitionChild: { template: "<div><slot /></div>" },
          Dialog: { template: "<div><slot /></div>" },
          DialogPanel: { template: "<div><slot /></div>" },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    active = ref(3);
    company = ref({ directors: [{ name: "Director 1" }] });
    getCompanyData = vi.fn();
    wrapper = createWrapper();
  });

  const getButtonByText = (text) => {
    return wrapper.findAll("button").find(b => b.text().includes(text));
  };

  it("initializes form directors from company info", () => {
    expect(wrapper.vm.form.directors).toHaveLength(1);
  });

  it("opens modal to add director when add button is clicked", async () => {
    const addButton = wrapper.find("button.bg-primary-500");
    await addButton.trigger("click");
    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.action).toBe("add");
  });

  it("decrements active state when Back is clicked", async () => {
    const backBtn = getButtonByText("Back");
    await backBtn.trigger("click");
    expect(active.value).toBe(2);
  });

  it("sets up deletion state when handleDelete is called", async () => {
    wrapper.vm.handleDelete(0);
    expect(wrapper.vm.id).toBe(0);
    expect(wrapper.vm.action).toBe("delete");
    expect(wrapper.vm.open).toBe(true);
  });

  it("removes director from list when onDelete is triggered", async () => {
    wrapper.vm.handleDelete(0);
    wrapper.vm.onDelete();
    expect(wrapper.vm.form.directors).toHaveLength(0);
    expect(wrapper.vm.open).toBe(false);
  });

  it("sets up editing state when handleEdit is called", async () => {
    const data = { name: "Jane" };
    wrapper.vm.handleEdit(1, data);
    expect(wrapper.vm.id).toBe(1);
    expect(wrapper.vm.director).toEqual(data);
    expect(wrapper.vm.action).toBe("edit");
  });

  it("submits directors and updates active state on success", async () => {
    settingservices.updateDirectors.mockResolvedValue({ status: 200 });
    await wrapper.vm.handleSubmit();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(getCompanyData).toHaveBeenCalled();
    expect(active.value).toBe(4);
  });

  it("stops submission if directors list is empty", async () => {
    wrapper.vm.form.directors = [];
    await wrapper.vm.handleSubmit();
    expect(settingservices.updateDirectors).not.toHaveBeenCalled();
  });

  it("handles submission errors", async () => {
    settingservices.updateDirectors.mockRejectedValue({ 
      response: { data: { message: "Error" } } 
    });
    await wrapper.vm.handleSubmit();
    await new Promise(resolve => setTimeout(resolve, 0));
    await nextTick();
    expect(wrapper.vm.isLoading).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it("disables next button when directors is empty", async () => {
    wrapper.vm.form.directors = [];
    await nextTick();
    const nextBtn = getButtonByText("Next");
    expect(nextBtn.element.disabled).toBe(true);
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import UsersTable from "@/components/Pages/Superadmin/Users/users-table.vue";
import * as userservices from "~/services/userservices";
import { toast } from "vue3-toastify";
import { navigateTo } from "#app";

vi.mock("#app", () => ({
  navigateTo: vi.fn(),
}));

vi.mock("~/stores/auth", () => ({
  useAuthStore: () => ({
    userInfo: { userCategory: 3 },
    appList: [{ code: "app1", name: "App 1" }],
  }),
}));

vi.mock("~/services/userservices", () => ({
  getAllUsers: vi.fn(),
  toggleUserStatus: vi.fn(),
  getCentralAdminUsers: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn: any) => fn,
}));

vi.mock("@headlessui/vue", () => ({
  Menu: { template: "<div><slot /></div>" },
  MenuButton: { template: "<button><slot /></button>" },
  MenuItem: { template: "<div><slot /></div>" },
  MenuItems: { template: "<div><slot /></div>" },
}));

vi.mock("@headlessui-float/vue", () => ({
  Float: { template: "<div><slot /></div>" },
}));

vi.mock("@vuepic/vue-datepicker", () => ({
  default: {
    template: "<input data-testid='datepicker' />",
  },
}));

describe("Users Table", () => {
  let wrapper: any;

  const mockData = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      contactEmail: "john@mail.com",
      phone: "123",
      signUpAppCode: "app1",
      created: "2024-01-01",
      lastLoginTime: "2024-01-02",
      isActive: true,
      category: "admin",
    },
  ];

  const createWrapper = () =>
    mount(UsersTable, {
      global: {
        stubs: {
          CustomTable: {
            template: `
              <div>
                <button class="view-btn" @click="$emit('view')">View</button>
                <slot name="table-row-action" :row="rows[0]" />
              </div>
            `,
            props: ["rows", "columns", "isLoading", "query"],
          },
          AppIcon: true,
          ClientOnly: { template: "<div><slot /></div>" },
          SelectVueSelect: {
            template:
              "<select @change='$emit(\"update:modelValue\", $event.target.value)'></select>",
            props: ["modelValue", "options"],
          },
          ActionModal: {
            template:
              "<div><button id='confirm' @click='$emit(\"actionItem\")'></button></div>",
            props: ["open"],
          },
        },
      },
    });

  const wait = () => new Promise((r) => setTimeout(r, 50));
  const flush = () => new Promise((r) => setTimeout(r, 0));

  beforeEach(() => {
    vi.clearAllMocks();
    userservices.getAllUsers.mockResolvedValue({
      data: { data: mockData, totalCount: 1 },
    });
  });

  it("fetches users on mount", async () => {
    wrapper = createWrapper();
    await wait();
    expect(userservices.getAllUsers).toHaveBeenCalled();
    expect(wrapper.vm.rows.length).toBe(1);
  });

  it("maps data correctly", async () => {
    wrapper = createWrapper();
    await wait();
    const row = wrapper.vm.rows[0];
    expect(row.name).toBe("John Doe");
    expect(row.signUpAppCode).toBe("App 1");
    expect(row.status).toBe(1);
  });

  it("handles search input", async () => {
    wrapper = createWrapper();
    await wait();

    const input = wrapper.find("input[type='search']");
    await input.setValue("abc");
    await input.trigger("input");

    await wait();
    expect(userservices.getAllUsers).toHaveBeenCalledTimes(2);
  });

  it("updates pagination", async () => {
    wrapper = createWrapper();
    await wait();

    wrapper.vm.queryParams.PageNumber = 2;
    await nextTick();

    expect(userservices.getAllUsers).toHaveBeenCalledTimes(2);
  });

  it("updates role filter", async () => {
    wrapper = createWrapper();

    wrapper.vm.queryParams.userCatText = "admins";
    await nextTick();

    expect(wrapper.vm.queryParams.userCategories).toEqual([0]);
  });

  it("updates date range", async () => {
    wrapper = createWrapper();

    wrapper.vm.date = ["2024-01-01", "2024-01-02"];
    await nextTick();

    expect(wrapper.vm.queryParams.from).toBeTruthy();
    expect(wrapper.vm.queryParams.to).toBeTruthy();
  });

  it("handles toggle status success", async () => {
    userservices.toggleUserStatus.mockResolvedValue({ status: 200 });

    wrapper = createWrapper();
    await wait();

    wrapper.vm.id = "test@mail.com";

    await wrapper.vm.handleDelete();
    await flush();

    expect(userservices.toggleUserStatus).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it("renders component", async () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });
});
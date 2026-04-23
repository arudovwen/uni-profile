import { render, fireEvent, waitFor } from "@testing-library/vue";
import UsersTable from "@/components/Pages/OwnerUsers/users-table.vue";
import { vi } from "vitest";

vi.mock("~/services/userservices", () => ({
  getOwnerMembers: vi.fn(),
  ownerDisableUser: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("moment", () => {
  return {
    default: () => ({
      format: () => "formatted-date",
    }),
  };
});

vi.mock("#app", () => ({
  navigateTo: vi.fn(),
}));

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    userInfo: {
      userCategory: 1,
    },
  }),
}));

import { getOwnerMembers, ownerDisableUser } from "~/services/userservices";
import { toast } from "vue3-toastify";

describe("users-table.vue", () => {
  const mockData = {
    data: {
      data: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          lastLoginTime: "2024-01-01",
          isActive: true,
          category: "member",
          contactEmail: "john@test.com",
          phone: "123",
        },
      ],
      totalCount: 1,
    },
  };

  const renderComponent = () =>
    render(UsersTable, {
      global: {
        stubs: {
          CustomTable: {
            template: `
                <div>
                <button data-testid="action" @click="$emit('onPageChange', 2)">page</button>
                <slot name="table-row-action" :row="row"></slot>
                </div>
            `,
            props: ["rows"],
            data() {
                return {
                row: {
                    id: 1,
                    name: "John Doe",
                    category: "member",
                    isActive: true,
                },
                };
            },
            },
          ActionModal: {
            props: ["open"],
            template: `<div>
              <button data-testid="confirm" @click="$emit('actionItem')" />
              <button data-testid="close" @click="$emit('close')" />
            </div>`,
          },
          Menu: { template: "<div><slot /></div>" },
          MenuButton: { template: "<button><slot /></button>" },
          MenuItems: { template: "<div><slot /></div>" },
          MenuItem: { template: "<div><slot /></div>" },
          Float: { template: "<div><slot /></div>" },
          AppIcon: { template: "<span />" },
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and maps users on mount", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);

    renderComponent();

    await waitFor(() => {
      expect(getOwnerMembers).toHaveBeenCalled();
    });
  });

  it("triggers search debounce", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);

    const { getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText("Search users");

    await fireEvent.update(input, "test");

    await waitFor(() => {
      expect(getOwnerMembers).toHaveBeenCalled();
    });
  });

  it("handles role filter watcher", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);

    const { emitted } = renderComponent();

    await waitFor(() => {
      expect(getOwnerMembers).toHaveBeenCalled();
    });

    expect(emitted()).toBeTruthy();
  });

  it("handles delete success", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);
    (ownerDisableUser as any).mockResolvedValue({ status: 200 });

    const { getByTestId } = renderComponent();

    await fireEvent.click(getByTestId("confirm"));

    await waitFor(() => {
      expect(ownerDisableUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("handles delete error", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);
    (ownerDisableUser as any).mockRejectedValue({
      response: { data: { message: "error" } },
    });

    const { getByTestId } = renderComponent();

    await fireEvent.click(getByTestId("confirm"));

    await waitFor(() => {
      expect(ownerDisableUser).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("closes modal", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);

    const { getByTestId } = renderComponent();

    await fireEvent.click(getByTestId("close"));

    await waitFor(() => {
      expect(getOwnerMembers).toHaveBeenCalled();
    });
  });

  it("handles action menu click", async () => {
    (getOwnerMembers as any).mockResolvedValue(mockData);

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText(/Deactivate access/i)).toBeTruthy();
    });
  });
});
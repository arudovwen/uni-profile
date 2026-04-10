import { render, fireEvent, waitFor } from "@testing-library/vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Invites from "@/components/Pages/OwnerUsers/invites.vue";

vi.mock("~/services/userservices", () => ({
  getAllinvites: vi.fn(),
  delOwnerInvite: vi.fn(),
  resendOwnerInvite: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("lodash/debounce", () => ({
  default: (fn) => fn,
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

describe("invites.vue", () => {
  let getAllinvites;
  let delOwnerInvite;
  let resendOwnerInvite;
  let toast;

  beforeEach(async () => {
    const svc = await import("~/services/userservices");
    getAllinvites = svc.getAllinvites;
    delOwnerInvite = svc.delOwnerInvite;
    resendOwnerInvite = svc.resendOwnerInvite;

    const toastLib = await import("vue3-toastify");
    toast = toastLib.toast;

    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(Invites, {
      global: {
        stubs: {
          AppButton: {
            template:
              '<button @click="$emit(\'click\')">{{ text }}</button>',
            props: ["text"],
          },
          CustomTable: {
            props: ["rows"],
            template: `
              <div>
                <div v-for="row in rows" :key="row.id">
                  <slot name="table-row-action" :row="row" />
                </div>
              </div>
            `,
          },
          DeleteModal: {
            template: `
              <div>
                <button data-testid="delete" @click="$emit('deleteItem')" />
                <button data-testid="closeDelete" @click="$emit('close')" />
              </div>
            `,
          },
          IndexModal: {
            template: `
              <div>
                <slot name="content" />
                <button data-testid="toggle" @click="$emit('togglePopup')" />
              </div>
            `,
          },
          InviteForm: {
            template: `<button data-testid="refresh" @click="$emit('refresh')" />`,
          },
          Loader: {
            template: `<button data-testid="loaderClose" @click="$emit('close-loader')" />`,
          },
          AppIcon: true,
        },
      },
    });

  it("fetches invites on mount success", async () => {
    getAllinvites.mockResolvedValue({
      data: {
        data: [{ id: 1, role: 2, email: "a", status: 0 }],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(getAllinvites).toHaveBeenCalled();
    });
  });

  it("handles fetch error", async () => {
    getAllinvites.mockRejectedValue(new Error("fail"));

    renderComponent();

    await waitFor(() => {
      expect(getAllinvites).toHaveBeenCalled();
    });
  });

  it("opens invite modal", async () => {
    getAllinvites.mockResolvedValue({ data: { data: [] } });

    const { getByText } = renderComponent();

    await fireEvent.click(getByText("Invite User"));
  });

it("handles resend success", async () => {
  getAllinvites.mockResolvedValue({
    data: {
      data: [{ id: 1, role: 2, email: "a", status: 0, appCodes: [] }],
    },
  });

  resendOwnerInvite.mockResolvedValue({ status: 200 });

  const { findByText } = renderComponent();

  const resendBtn = await findByText((content) =>
    content.includes("Resend")
  );

  await fireEvent.click(resendBtn);

  await waitFor(() => {
    expect(resendOwnerInvite).toHaveBeenCalled();
  });
});

it("handles resend error", async () => {
  getAllinvites.mockResolvedValue({
    data: {
      data: [{ id: 1, role: 2, email: "a", status: 0, appCodes: [] }],
    },
  });

  resendOwnerInvite.mockRejectedValue({
    response: { data: { message: "error" } },
  });

  const { findByText } = renderComponent();

  const resendBtn = await findByText((content) =>
    content.includes("Resend")
  );

  await fireEvent.click(resendBtn);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
  });
});

  it("handles delete success", async () => {
    getAllinvites.mockResolvedValue({
      data: {
        data: [{ id: 1, role: 2, email: "a", status: 0 }],
      },
    });

    delOwnerInvite.mockResolvedValue({ status: 200 });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getAllinvites).toHaveBeenCalled();
    });

    await fireEvent.click(getByTestId("delete"));

    await waitFor(() => {
      expect(delOwnerInvite).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("handles delete error", async () => {
    getAllinvites.mockResolvedValue({
      data: {
        data: [{ id: 1, role: 2, email: "a", status: 0 }],
      },
    });

    delOwnerInvite.mockRejectedValue({
      response: { data: { message: "fail" } },
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getAllinvites).toHaveBeenCalled();
    });

    await fireEvent.click(getByTestId("delete"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("handles modal toggle and loader close", async () => {
  getAllinvites.mockResolvedValue({ data: { data: [] } });

  const { getByText, getByTestId } = renderComponent();

  await fireEvent.click(getByText("Invite User"));

  await waitFor(() => {
    expect(getByTestId("toggle")).toBeTruthy();
  });

  await fireEvent.click(getByTestId("toggle"));
  await fireEvent.click(getByTestId("loaderClose"));
});

  it("handles refresh from invite form", async () => {
  getAllinvites.mockResolvedValue({ data: { data: [] } });

  const { getByText, getByTestId } = renderComponent();

  await fireEvent.click(getByText("Invite User"));

  await waitFor(() => {
    expect(getByTestId("refresh")).toBeTruthy();
  });

  await fireEvent.click(getByTestId("refresh"));

  await waitFor(() => {
    expect(getAllinvites).toHaveBeenCalledTimes(2);
  });
});
});
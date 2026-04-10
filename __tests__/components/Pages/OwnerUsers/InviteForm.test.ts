import { render, fireEvent, waitFor } from "@testing-library/vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InviteForm from "@/components/Pages/OwnerUsers/InviteForm.vue";

vi.mock("~/services/userservices", () => ({
  sendOwnerInvite: vi.fn(),
}));

vi.mock("vue3-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockUseForm = () => {
  return {
    handleSubmit: (fn) => fn,
    defineField: (name) => {
      if (name === "email") return ["test@example.com", {}];
      if (name === "role") return [2];
      return ["", {}];
    },
    errors: {},
    values: {},
    meta: {},
    resetForm: vi.fn(),
    setValues: vi.fn(),
    setFieldValue: vi.fn(),
  };
};

vi.mock("vee-validate", async () => {
  const actual = await vi.importActual("vee-validate");
  return {
    ...actual,
    useForm: () => ({
      handleSubmit: (fn) => fn,
      defineField: (name) => {
        if (name === "email") return ["test@example.com", {}];
        if (name === "role") return [2];
        return ["", {}];
      },
      errors: {},
      values: {},
      meta: {},
      resetForm: vi.fn(),
      setValues: vi.fn(),
      setFieldValue: vi.fn(),
    }),
  };
});

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    userInfo: {
      subAppCodes: [{ appCode: "A", role: "user" }],
      companyName: "TestCo",
    },
  }),
}));

describe("InviteForm.vue", () => {
  let sendOwnerInvite;
  let toast;

  beforeEach(async () => {
    const svc = await import("~/services/userservices");
    sendOwnerInvite = svc.sendOwnerInvite;

    const toastLib = await import("vue3-toastify");
    toast = toastLib.toast;

    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(InviteForm, {
      props,
      global: {
        provide: {
          isOpen: { value: true },
        },
        stubs: {
          Textinput: true,
          FormGroup: true,
          SelectVueSelect: true,
          AppButton: {
            template: `<button @click="$emit('click')" :type="type"><slot />{{ text }}</button>`,
            props: ["text", "type"],
          },
          ActionModal: {
            template: `
              <div>
                <button data-testid="another" @click="$emit('anotherAction')" />
                <button data-testid="action" @click="$emit('actionItem')" />
                <button data-testid="close" @click="$emit('close')" />
              </div>
            `,
          },
          ProfileAddIcon: true,
        },
      },
    });
  };

  it("renders correctly without detail", () => {
    const { getByText } = renderComponent({ detail: false });
    expect(getByText("Invite a Team member")).toBeTruthy();
    expect(
      getByText("Invite team members to join your organization")
    ).toBeTruthy();
  });

  it("hides subtitle when detail is true", () => {
    const { queryByText } = renderComponent({ detail: true });
    expect(
      queryByText("Invite team members to join your organization")
    ).toBeNull();
  });

  it("submits successfully and opens success modal", async () => {
    sendOwnerInvite.mockResolvedValue({ status: 200 });

    const { getByText, emitted } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(sendOwnerInvite).toHaveBeenCalled();
    });

    expect(emitted().refresh).toBeTruthy();
  });

  it("handles API error and shows toast", async () => {
    sendOwnerInvite.mockRejectedValue({
      response: { data: { message: "Failed" } },
    });

    const { getByText } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed");
    });
  });

  it("handles generic error message", async () => {
    sendOwnerInvite.mockRejectedValue({});

    const { getByText } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An error occurred");
    });
  });

  it("handles cancel button click", async () => {
    const { getByText } = renderComponent();

    await fireEvent.click(getByText("Cancel"));
  });

  it("handles modal anotherAction", async () => {
    sendOwnerInvite.mockResolvedValue({ status: 200 });

    const { getByText, getByTestId } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(sendOwnerInvite).toHaveBeenCalled();
    });

    await fireEvent.click(getByTestId("another"));
  });

  it("handles modal actionItem", async () => {
    sendOwnerInvite.mockResolvedValue({ status: 200 });

    const { getByText, getByTestId } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(sendOwnerInvite).toHaveBeenCalled();
    });

    await fireEvent.click(getByTestId("action"));
  });

  it("handles modal close", async () => {
    sendOwnerInvite.mockResolvedValue({ status: 200 });

    const { getByText, getByTestId } = renderComponent();

    await fireEvent.click(getByText("Send Invite"));

    await waitFor(() => {
      expect(sendOwnerInvite).toHaveBeenCalled();
    });

    await fireEvent.click(getByTestId("close"));
  });
});
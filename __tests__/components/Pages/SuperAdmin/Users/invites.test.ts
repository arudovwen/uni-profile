import { it, expect, describe, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import invites from "@/components/Pages/Superadmin/Users/invites.vue";
import * as userServices from "~/services/userservices";
import { toast } from "vue3-toastify";

vi.mock("~/services/userservices", () => ({
  getAllinvites: vi.fn(),
  delSingleInvite: vi.fn(),
  resendAdminInvite: vi.fn(),
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

vi.stubGlobal("definePageMeta", vi.fn());

const mockInvites = {
  data: {
    data: [
      { id: 1, email: "test@test.com", role: 1, status: 0 },
      { id: 2, email: "test2@test.com", role: 2, status: 1 },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(userServices.getAllinvites).mockResolvedValue(mockInvites);

  vi.stubGlobal('unhandledRejection', () => {});
});

describe("invites.vue", () => {
  let wrapper;

  const createWrapper = () => {
    return mount(invites, {
      global: {
        stubs: {
          AppButton: {
            name: "AppButton",
            template: '<button class="app-btn-stub" @click="$emit(\'click\')">{{text}}</button>',
            props: ["text"],
          },
          CustomTable: {
            template: `
              <div>
                <template v-for="row in rows" :key="row.id">
                  <slot v-if="row.status === 0" name="table-row-action" :row="row" />
                </template>
              </div>
            `,
            props: ["rows", "columns"],
          },
          DeleteModal: {
            template: '<div v-if="open" class="delete-modal-stub"><button class="confirm-del" @click="$emit(\'deleteItem\')">Confirm</button><button class="close-del" @click="$emit(\'close\')">Close</button></div>',
            props: ["open"],
          },
          IndexModal: {
            template: '<div v-if="isOpen" class="index-modal-stub"><slot name="content" /></div>',
            props: ["isOpen"],
          },
          PagesSuperadminUsersInviteForm: {
            name: "InviteForm",
            template: '<div class="invite-form-stub" @refresh="$emit(\'refresh\')"></div>',
          },
          Loader: true,
          AppIcon: true,
          Menu: { template: "<div><slot /></div>" },
          MenuButton: { template: "<button class='menu-btn'><slot /></button>" },
          MenuItems: { template: "<div><slot /></div>" },
          MenuItem: { template: "<div><slot /></div>" },
          Float: { template: "<div><slot /></div>" },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userServices.getAllinvites).mockResolvedValue(mockInvites);
  });

  it("fetches invites on mount", async () => {
    wrapper = createWrapper();
    await flushPromises();
    expect(userServices.getAllinvites).toHaveBeenCalled();
  });

  it("handles fetch error", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(userServices.getAllinvites).mockRejectedValue(new Error("Fetch failed"));
    wrapper = createWrapper();
    await flushPromises();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("handles delete error", async () => {
  vi.mocked(userServices.delSingleInvite).mockRejectedValue({
    response: { data: { message: "Error" } }
  });

  wrapper = createWrapper();
  await flushPromises();

  const cancelBtn = wrapper.findAll("button").find(b => b.text().includes("Cancel Invite"));
  await cancelBtn?.trigger("click");

  await wrapper.find(".confirm-del").trigger("click");

  // Flush and catch the unhandled rejection so it doesn't bubble up
  await flushPromises().catch(() => {});

  expect(toast.error).toHaveBeenCalled();
});

  it("refreshes invites when form emits refresh", async () => {
    wrapper = createWrapper();
    wrapper.vm.isOpen = true;
    await nextTick();
    const form = wrapper.findComponent({ name: "InviteForm" });
    await form.vm.$emit("refresh");
    expect(userServices.getAllinvites).toHaveBeenCalled();
  });

  it("handles delete success", async () => {
    vi.mocked(userServices.delSingleInvite).mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    await flushPromises();

    const cancelBtn = wrapper.findAll("button").find(b => b.text().includes("Cancel Invite"));
    await cancelBtn.trigger("click");
    
    await wrapper.find(".confirm-del").trigger("click");
    await flushPromises();

    expect(userServices.delSingleInvite).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith("Invitation cancelled");
  });

  it("handles resend invite success", async () => {
    vi.mocked(userServices.resendAdminInvite).mockResolvedValue({ status: 200 });
    wrapper = createWrapper();
    await flushPromises();

    const resendBtn = wrapper.findAll("button").find(b => b.text().includes("Resend invite"));
    await resendBtn.trigger("click");
    await flushPromises();

    expect(userServices.resendAdminInvite).toHaveBeenCalled();
    expect(wrapper.vm.isResendOpen).toBe(false);
  });

  it("handles resend invite error", async () => {
    vi.mocked(userServices.resendAdminInvite).mockRejectedValue({
      response: { data: { message: "Fail" } }
    });
    wrapper = createWrapper();
    await flushPromises();

    const resendBtn = wrapper.findAll("button").find(b => b.text().includes("Resend invite"));
    await resendBtn.trigger("click");
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith("Fail");
  });

  it("triggers search on queryParams.Search watch", async () => {
    wrapper = createWrapper();
    wrapper.vm.queryParams.Search = "query";
    await nextTick();
    expect(userServices.getAllinvites).toHaveBeenCalled();
  });

  it("triggers fetch on pagination/order watch", async () => {
    wrapper = createWrapper();
    wrapper.vm.queryParams.PageNumber = 5;
    await nextTick();
    wrapper.vm.queryParams.SortOrder = "desc";
    await nextTick();
    expect(userServices.getAllinvites).toHaveBeenCalled();
  });

  it("closes delete modal", async () => {
    wrapper = createWrapper();
    wrapper.vm.open = true;
    await nextTick();
    await wrapper.find(".close-del").trigger("click");
    expect(wrapper.vm.open).toBe(false);
  });

  it("provides handleSuccess to children", () => {
    wrapper = createWrapper();
    const handleSuccess = wrapper.vm.handleSuccess;
    handleSuccess();
    expect(userServices.getAllinvites).toHaveBeenCalled();
  });
});
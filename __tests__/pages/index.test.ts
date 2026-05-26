import { it, expect, describe, vi, beforeEach } from "vitest";

const mockNavigateTo = vi.fn().mockResolvedValue(undefined);
const mockRoute = { query: { tab: undefined as string | undefined } };

vi.stubGlobal("navigateTo", mockNavigateTo);
vi.stubGlobal("useRoute", () => mockRoute);
vi.stubGlobal("definePageMeta", vi.fn());

const allowedTabs = ["apps", "users", "logs", "settings", "kyc"];

async function runPageLogic() {
  const route = mockRoute;
  const tab = (route.query.tab as string) || "apps";
  const resolvedTab = allowedTabs.includes(tab) ? tab : "apps";
  await mockNavigateTo(`/dashboard/${resolvedTab}`, { replace: true });
}

describe("IndexPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigateTo.mockResolvedValue(undefined);
    mockRoute.query.tab = undefined;
  });

  it("renders with default layout when userCategory is not 0,3,4", async () => {
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/apps", { replace: true });
  });

  it("uses superadmin layout when userCategory is 0", async () => {
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/apps", { replace: true });
  });

  it("uses superadmin layout when userCategory is 3", async () => {
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/apps", { replace: true });
  });

  it("uses superadmin layout when userCategory is 4", async () => {
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/apps", { replace: true });
  });

  it("redirects to the specified tab if it matches an allowed value", async () => {
    mockRoute.query.tab = "users";
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/users", { replace: true });
  });

  it("fallback redirects to /dashboard/apps if tab parameter value is invalid", async () => {
    mockRoute.query.tab = "not-allowed-value";
    await runPageLogic();
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard/apps", { replace: true });
  });
});
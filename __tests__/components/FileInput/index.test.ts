import { render } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import index from "~/components/Fileinput/index.vue";

describe("FileInput", () => {
  vi.mock("vue-router", () => {
    return {
      RouterView: {},
      useRouter: () => {
        return {
          push: vi.fn,
        };
      },
      useRoute: vi.fn().mockImplementation(() => ({
        fullPath: "",
        hash: "",
        matched: [],
        name: "",
        meta: {},
        params: {
          category: "testcat",
        },
        path: "",
        query: {
          // @ts-ignore
          onboarding_stage: 2,
        },
        redirectedFrom: undefined,
      })),
    };
  });
  it("Should render without error", () => {
    const component = render(index);
    expect(screen).toMatchSnapshot();
  });
});

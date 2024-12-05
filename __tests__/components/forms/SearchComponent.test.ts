// Properties.test.js
import { mount } from "@vue/test-utils";
import SearchComponent from "~/components/forms/SearchComponent.vue";
import { createRouter, createWebHistory } from "vue-router";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Plugin } from "vue";
import Vuex, { createStore, mapActions } from "vuex";

const mockRoutePush = vi.fn();
const store = createStore({
  state: {
    loggedUser: {
      fullName: "Oduro Tolulope",
      phoneNumber: "07036845422",
    },
  },
  getters: {
    loggedUser: () => ({
      fullName: "Oduro Tolulope",
      phoneNumber: "07036845422",
    }),
  },
});

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
describe("SearchComponent", () => {
    
  it("renders correctly", async () => {
    const wrapper = mount(SearchComponent, {
      global: {
        plugins: [store],
      },
    });
    expect(screen).toMatchSnapshot();
  });
});

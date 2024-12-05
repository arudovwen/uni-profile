import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import { RouterLinkStub } from "@vue/test-utils";
import { it, expect, describe, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import * as authServices from "~/services/authservices";
import * as vueRouter  from "vue-router";
import Table from "~/components/Skeleton/Project-grid.vue";

describe("Table", () => {

  it("renders", async () => {
    const component = render(Table, {
      props: {},
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                loggedUser: {
                  firstName: "Bruce",
                  lastName: "Wayne",
                },
              },
            },
          }),
        ],
        mocks: {},
      },
    });
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

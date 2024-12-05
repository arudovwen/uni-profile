import { it, expect, describe, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import defaultLayout from "~/layouts/default.vue";
import { createTestingPinia } from '@pinia/testing';


describe("default", () => {
  it("Mounts without error", async () => {
    
    const component = render(defaultLayout, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                loggedUser: {
                  fullName: 'Oduro Tolulope',
                  phoneNumber: '07036845422',
                },
              },
            },
          }),
        ],
        stubs: {
          NuxtLink: true,
          AppHeader: true,
          AppFooter: true,
        },
      },
    });
    
    expect(screen).toMatchSnapshot();
    component.unmount();
  });
});

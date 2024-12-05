import { render, screen, fireEvent } from "@testing-library/vue";
import { it, expect, describe } from "vitest";
import AccountType from "../components/onboarding/AccountType.vue";
import { mount } from "@vue/test-utils";
import AccordionComponent from "~/components/accordion/AccordionComponent.vue";
import VendorSignUp from "~/components/Auth/VendorSignUp.vue";

describe("VendorSignup", () => {
  it("renders", () => {
    const { getByPlaceholderText } = render(VendorSignUp, {
      global: {
        provide: {
          step: ref(1),
        },
      },
    });

    const firstNameInput = screen.getByTestId("First name") as HTMLInputElement;
    const lastNameInput = screen.getByTestId("Last name") as HTMLInputElement;
    const emailInput = screen.getByTestId("Email") as HTMLInputElement;
    const phoneInput = screen.getByTestId("Phone number") as HTMLInputElement;
    const passwordInput = screen.getByTestId("Password") as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId(
      "Confirm Password"
    ) as HTMLInputElement;

    // Assert that all inputs are rendered
    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(phoneInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();

    // const someInputs = screen.getAllByPlaceholderText("")

    fireEvent.update(firstNameInput, { target: { value: "Bruce" } });
    fireEvent.update(lastNameInput, { target: { value: "Wayne" } });
    fireEvent.update(phoneInput, { target: { value: "12345678910" } });
    fireEvent.update(passwordInput, { target: { value: "PassWord" } });
    fireEvent.update(confirmPasswordInput, { target: { value: "PassWord" } });
    fireEvent.update(emailInput, { target: { value: "bruce@wayne.com" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByTestId("btn"));
  });
});

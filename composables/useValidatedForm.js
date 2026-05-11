import { useForm as useVeeForm } from "vee-validate";

/**
 * Wrapper around VeeValidate's useForm that configures validation to only happen on form submission.
 * This prevents validation errors from showing while the user is typing, improving UX.
 *
 * @param options - VeeValidate form options
 * @returns VeeValidate form instance with onSubmit mode enabled
 */
export const useValidatedForm = (options) => {
  return useVeeForm({
    ...options,
    // Validate only on form submission, not on change or blur
    mode: "onSubmit",
  });
};

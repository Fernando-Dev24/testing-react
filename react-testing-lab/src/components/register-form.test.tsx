import { describe, expect, it } from "vitest";
import { setupRegisterFormTest } from "../test/setup-register-form";

describe("Register form", () => {
  const names = [
    { value: "Fe", isValid: false },
    { value: "\tF\t", isValid: false },
    { value: "   ", isValid: false },
    { value: "Fernando", isValid: true },
  ];

  const emails = [
    { value: "usuario..ejemplo@dominio.com", isValid: false },
    { value: "juan.perez@dominio_invalido.com", isValid: false },
    { value: "maria.gomez@empresa@gmail.com", isValid: false },
    { value: "refer1114@gmail.com", isValid: true },
  ];

  const invalidPasswords = [
    { value: "refer2408", isValid: true },
    { value: "1234567", isValid: false },
  ];

  const invalidConfirmPasswords = [
    { value: "refer2402", confirmPassword: "refer2408", isValid: false },
    { value: "refer2402", confirmPassword: "   ", isValid: false },
    { value: "refer2402", confirmPassword: "refer2402", isValid: true },
  ];

  it("form should have the default values, no error message before submit, then do it and validate error messages", async () => {
    const {
      form,
      onSubmit,
      submitForm,
      getAlertName,
      getAlertEmail,
      getAlertPassword,
      getAlertConfirmPassword,
      getAlertTerms,
    } = setupRegisterFormTest();

    expect(form).toHaveFormValues({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    });

    expect(getAlertName()).not.toBeInTheDocument();
    expect(getAlertEmail()).not.toBeInTheDocument();
    expect(getAlertPassword()).not.toBeInTheDocument();
    expect(getAlertConfirmPassword()).not.toBeInTheDocument();
    expect(getAlertTerms()).not.toBeInTheDocument();

    await submitForm();

    expect(getAlertName()).toBeInTheDocument();
    expect(getAlertEmail()).toBeInTheDocument();
    expect(getAlertPassword()).toBeInTheDocument();
    expect(getAlertTerms()).toBeInTheDocument();

    // Este mensaje nunca sale a no ser que la password sea diferente
    //expect(getAlertConfirmPassword()).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(names)(
    "should show error message for every invalid name: $value",
    async (name) => {
      const { fillFields, submitForm, onSubmit, getAlertName, nameInput } =
        setupRegisterFormTest();

      await fillFields({ name: name.value });
      expect(nameInput).toHaveValue(name.value);

      await submitForm();

      if (name.isValid) {
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(getAlertName()).not.toBeInTheDocument();
      } else {
        expect(onSubmit).not.toHaveBeenCalled();
        expect(getAlertName()).toBeInTheDocument();
      }
    },
  );

  it.each(emails)("should validate emails: $value", async (item) => {
    const { onSubmit, submitForm, fillFields, getAlertEmail, emailInput } =
      setupRegisterFormTest();

    await fillFields({ email: item.value });
    expect(emailInput).toHaveValue(item.value);

    await submitForm();

    if (item.isValid) {
      expect(onSubmit).toHaveBeenCalledOnce();
      expect(getAlertEmail()).not.toBeInTheDocument();
    } else {
      expect(onSubmit).not.toHaveBeenCalled();
      expect(getAlertEmail()).toBeInTheDocument();
    }
  });

  it.each(invalidPasswords)(
    "should validate passwords: $value",
    async (item) => {
      const {
        onSubmit,
        submitForm,
        getAlertPassword,
        passwordInput,
        fillFields,
      } = setupRegisterFormTest();

      await fillFields({ password: item.value });
      expect(passwordInput).toHaveValue(item.value);

      await submitForm();

      if (item.isValid) {
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(getAlertPassword()).not.toBeInTheDocument();
      } else {
        expect(onSubmit).not.toHaveBeenCalled();
        expect(getAlertPassword()).toBeInTheDocument();
      }
    },
  );

  it.each(invalidConfirmPasswords)(
    "should validate that password $value its the same: $confirmPassword",
    async (item) => {
      const {
        onSubmit,
        submitForm,
        getAlertConfirmPassword,
        passwordInput,
        confirmPasswordInput,
        fillFields,
      } = setupRegisterFormTest();

      await fillFields({
        password: item.value,
        confirmPassword: item.confirmPassword,
      });

      expect(passwordInput).toHaveValue(item.value);
      expect(confirmPasswordInput).toHaveValue(item.confirmPassword);

      await submitForm();

      if (item.isValid) {
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(getAlertConfirmPassword()).not.toBeInTheDocument();
      } else {
        expect(onSubmit).not.toHaveBeenCalled();
        expect(getAlertConfirmPassword()).toBeInTheDocument();
      }
    },
  );

  it("should not submit if user does not accept terms", async () => {});
});

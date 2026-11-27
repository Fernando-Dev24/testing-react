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

  it("should not submit if user does not accept terms", async () => {
    const { onSubmit, submitForm, toggleTerms, getAlertTerms, fillFields } =
      setupRegisterFormTest();

    await fillFields({ terms: false });
    await submitForm();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(getAlertTerms()).toBeInTheDocument();

    await toggleTerms();
    await submitForm();

    expect(onSubmit).toHaveBeenCalled();
    expect(getAlertTerms()).not.toBeInTheDocument();
  });

  it("should not render error messages when all fields were corrected", async () => {
    const {
      getAlertName,
      getAlertEmail,
      getAlertPassword,
      getAlertConfirmPassword,
      getAlertTerms,
      fillFields,
      onSubmit,
      submitForm,
    } = setupRegisterFormTest();

    await submitForm();
    expect(getAlertName()).toBeInTheDocument();
    expect(getAlertEmail()).toBeInTheDocument();
    expect(getAlertPassword()).toBeInTheDocument();
    expect(getAlertTerms()).toBeInTheDocument();

    await fillFields({ confirmPassword: "12345678" });
    await submitForm();

    expect(getAlertConfirmPassword()).toBeInTheDocument();
    expect(getAlertName()).not.toBeInTheDocument();
    expect(getAlertEmail()).not.toBeInTheDocument();
    expect(getAlertPassword()).not.toBeInTheDocument();
    expect(getAlertTerms()).not.toBeInTheDocument();

    await fillFields();
    await submitForm();

    expect(getAlertConfirmPassword()).not.toBeInTheDocument();

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("should rerender name error message when value is invalid after corrected", async () => {
    const { getAlertName, fillFields, onSubmit, submitForm } =
      setupRegisterFormTest();

    expect(getAlertName()).not.toBeInTheDocument();

    await submitForm();
    expect(getAlertName()).toBeInTheDocument();

    await fillFields();
    expect(getAlertName()).not.toBeInTheDocument();

    await fillFields({ name: "Fe" });
    expect(getAlertName()).toBeInTheDocument();

    await fillFields();
    await submitForm();
    expect(getAlertName()).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("should render password error when this field has changed after be valid", async () => {
    const {
      getAlertPassword,
      getAlertConfirmPassword,
      fillFields,
      onSubmit,
      submitForm,
    } = setupRegisterFormTest();

    await fillFields();
    await submitForm();

    expect(getAlertPassword()).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledOnce();

    await fillFields({ password: "123" });
    await submitForm();

    expect(getAlertPassword()).toBeInTheDocument();
    expect(getAlertConfirmPassword()).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("should not execute callback when user just fill the fields", async () => {
    const { onSubmit, fillFields } = setupRegisterFormTest();

    await fillFields();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit form and its values correctly", async () => {
    const {
      onSubmit,
      submitForm,
      fillFields,
      nameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      termsCheckbox,
    } = setupRegisterFormTest();

    await fillFields({
      name: "  Fer   ",
      email: "   refer1114@gmail.com   ",
    });
    await submitForm();

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Fer",
      email: "refer1114@gmail.com",
      password: "refer2408",
      terms: true,
    });
    expect(onSubmit).not.toHaveBeenCalledWith(
      expect.objectContaining({ confirmPassword: "refer2408" }),
    );

    expect(nameInput).toHaveValue("  Fer   ");
    expect(emailInput).toHaveValue("refer1114@gmail.com");
    expect(passwordInput).toHaveValue("refer2408");
    expect(confirmPasswordInput).toHaveValue("refer2408");
    expect(termsCheckbox).toBeChecked();
  });

  it("should use toBeInvalid and toHaveAccessibleDescription matchers", async () => {
    const { submitForm, onSubmit, fillFields, nameInput } =
      setupRegisterFormTest();

    await fillFields({ name: "Fe" });
    await submitForm();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(nameInput).toBeInvalid();
    expect(nameInput).toHaveAccessibleDescription(
      "El nombre debe tener al menos 3 caracteres",
    );
  });

  it("should submit form with Enter keyboard event", async () => {
    const { submitWithEnter, nameInput, fillFields, onSubmit } =
      setupRegisterFormTest();

    await fillFields();
    await submitWithEnter(nameInput);

    expect(onSubmit).toHaveBeenCalled();
  });
});

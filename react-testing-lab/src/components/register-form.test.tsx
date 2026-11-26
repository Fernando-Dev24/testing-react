import { describe, expect, it } from "vitest";
import { setupRegisterFormTest } from "../test/setup-register-form";

describe("Register form", () => {
  const invalidNamesForms = ["Fe", "\tF\t", "   "];

  const invalidEmailsForms = [
    "usuario..ejemplo@dominio.com",
    "juan.perez@dominio_invalido.com",
    "maria.gomez@empresa@gmail.com",
  ];

  const invalidPasswords = ["refer2408", "1234567"];

  const invalidConfirmPasswords = [
    { password: "refer2402", confirmPassword: "refer2408" },
    { password: "refer2402", confirmPassword: "" },
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
});

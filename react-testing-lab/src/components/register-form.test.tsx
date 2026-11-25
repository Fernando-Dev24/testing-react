import userEvent from "@testing-library/user-event";
import type { RegisterFormType } from "../core/schemas/register.schema";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegisterForm } from "./register-form";

type SetupOptions = {
  onSubmit?: (values: RegisterFormType) => Promise<void> | void;
};

export function setupRegisterFormTest(options: SetupOptions = {}) {
  const user = userEvent.setup();
  const onSubmit = options.onSubmit ?? vi.fn().mockResolvedValue(undefined);

  render(<RegisterForm onSubmit={onSubmit} />);

  const nameInput = screen.getByRole("textbox", { name: "Nombre de usuario" });
  const emailInput = screen.getByRole("textbox", {
    name: "Correo electrónico",
  });
  const passwordInput = screen.getByLabelText("Contraseña");
  const confirmPasswordInput = screen.getByLabelText("Confirmar contraseña");
  const termsCheckbox = screen.getByRole("checkbox", {
    name: "Acepto los términos y condiciones",
  });
  const submitButton = screen.getByRole("button", { name: "Crear cuenta" });

  async function fillAndSubmit(
    fields: RegisterFormType = {
      name: "Fernando Ortiz",
      email: "correo@correo.gmail.com",
      password: "refer2408",
      confirmPassword: "refer2408",
      terms: true,
    },
  ) {
    if (fields.name) {
      await user.clear(nameInput);
      await user.type(nameInput, fields.name);
    }
    if (fields.email) {
      await user.clear(emailInput);
      await user.type(emailInput, fields.email);
    }
    if (fields.password) {
      await user.clear(passwordInput);
      await user.type(passwordInput, fields.password);
    }
    if (fields.confirmPassword) {
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, fields.confirmPassword);
    }
    if (fields.terms) {
      await user.clear(termsCheckbox);
      await user.click(termsCheckbox);
    }

    await user.click(submitButton);
  }

  async function toggleTerms() {
    await user.click(termsCheckbox);
  }

  return {
    user,
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    termsCheckbox,
    submitButton,
    fillAndSubmit,
    toggleTerms,
    onSubmit,
  };
}

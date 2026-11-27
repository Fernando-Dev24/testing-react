import userEvent from "@testing-library/user-event";
import type {
  RegisterFormTypeInput,
  RegisterFormTypeOutput,
} from "../core/schemas/register.schema";
import { RegisterForm } from "../components/register-form";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

type SetupOptions = {
  onSubmit?: (values: RegisterFormTypeOutput) => Promise<void> | void;
};

const DEFAULT_REGISTER_VALUES: RegisterFormTypeInput = {
  name: "Fernando Ortiz",
  email: "correo@correo.gmail.com",
  password: "refer2408",
  confirmPassword: "refer2408",
  terms: true,
};

export function setupRegisterFormTest(options: SetupOptions = {}) {
  const user = userEvent.setup();
  const onSubmit = options.onSubmit ?? vi.fn().mockResolvedValue(undefined);

  render(<RegisterForm onSubmit={onSubmit} />);

  const form = screen.getByRole("form", { name: "Registro de usuario" });
  const nameInput = screen.getByRole("textbox", { name: "Nombre" });
  const emailInput = screen.getByRole("textbox", {
    name: "Correo electrónico",
  });
  const passwordInput = screen.getByLabelText("Contraseña");
  const confirmPasswordInput = screen.getByLabelText("Confirmar contraseña");
  const termsCheckbox = screen.getByRole("checkbox", {
    name: "Acepto los términos y condiciones",
  }) as HTMLInputElement;
  const submitButton = screen.getByRole("button", { name: "Crear cuenta" });

  function getAlertName() {
    return screen.queryByText("El nombre debe tener al menos 3 caracteres");
  }
  function getAlertEmail() {
    return screen.queryByText("El correo electrónico no es válido");
  }
  function getAlertPassword() {
    return screen.queryByText("La contraseña debe tener al menos 8 caracteres");
  }
  function getAlertConfirmPassword() {
    return screen.queryByText("Las contraseñas no coinciden");
  }
  function getAlertTerms() {
    return screen.queryByText("Debes aceptar los términos y condiciones");
  }

  async function fillFields(overrides: Partial<RegisterFormTypeInput> = {}) {
    const values = { ...DEFAULT_REGISTER_VALUES, ...overrides };

    if (values.name !== undefined) {
      await user.clear(nameInput);
      await user.type(nameInput, values.name);
    }
    if (values.email !== undefined) {
      await user.clear(emailInput);
      await user.type(emailInput, values.email);
    }
    if (values.password !== undefined) {
      await user.clear(passwordInput);
      await user.type(passwordInput, values.password);
    }
    if (values.confirmPassword !== undefined) {
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, values.confirmPassword);
    }
    if (termsCheckbox.checked !== values.terms) {
      await toggleTerms();
    }
  }

  async function toggleTerms() {
    await user.click(termsCheckbox);
  }

  async function submitForm() {
    await user.click(submitButton);
  }

  async function submitWithEnter(el: HTMLElement) {
    await user.click(el);
    await user.keyboard("{Enter}");
  }

  return {
    form,
    user,
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    termsCheckbox,

    getAlertName,
    getAlertEmail,
    getAlertPassword,
    getAlertConfirmPassword,
    getAlertTerms,

    submitButton,
    fillFields,
    submitForm,
    toggleTerms,
    onSubmit,
    submitWithEnter,
  };
}

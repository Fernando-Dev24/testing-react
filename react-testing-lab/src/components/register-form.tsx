import { ErrorMessage, FormProvider, useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormType,
} from "../core/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export type RegisterFormProps = {
  onSubmit: (data: RegisterFormType) => void;
};

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const form = useForm<RegisterFormType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const errors = form.getErrors();

  return (
    <article>
      <div>
        <h2>Crear cuenta</h2>
        <p>Completa tus datos para registrarte.</p>
      </div>

      <FormProvider {...form}>
        <form
          aria-label="registro"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="name">Nombre de usuario</label>
            <input
              type="text"
              id="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...form.register("name")}
            />
            {form.getFieldState("name").error && (
              <ErrorMessage
                name="name"
                control={form.control}
                render={({ message }) => (
                  <p id="name-error" role="alert">
                    {message}
                  </p>
                )}
              />
            )}
          </div>

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...form.register("email")}
            />
            {form.getFieldState("email").error && (
              <ErrorMessage
                name="email"
                control={form.control}
                render={({ message }) => (
                  <p id="email-error" role="alert">
                    {message}
                  </p>
                )}
              />
            )}
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            {form.getFieldState("password").error && (
              <ErrorMessage
                name="password"
                control={form.control}
                render={({ message }) => (
                  <p id="password-error" role="alert">
                    {message}
                  </p>
                )}
              />
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              {...form.register("confirmPassword")}
            />
            {form.getFieldState("confirmPassword").error && (
              <ErrorMessage
                name="confirmPassword"
                control={form.control}
                render={({ message }) => (
                  <p id="confirmPassword-error" role="alert">
                    {message}
                  </p>
                )}
              />
            )}
          </div>

          <div>
            <input
              type="checkbox"
              id="terms"
              {...form.register("terms")}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? "terms-error" : undefined}
            />
            <label htmlFor="terms">Acepto los términos y condiciones</label>
            {form.getFieldState("terms").error && (
              <ErrorMessage
                name="terms"
                control={form.control}
                render={({ message }) => (
                  <p id="terms-error" role="alert">
                    {message}
                  </p>
                )}
              />
            )}
          </div>

          <button type="submit" disabled={form.formState.isSubmitting}>
            Crear cuenta
          </button>
        </form>
      </FormProvider>
    </article>
  );
};

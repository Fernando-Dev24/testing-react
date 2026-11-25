import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ error: "El nombre debe tener al menos 3 caracteres" })
      .trim()
      .min(3, { error: "El nombre debe tener al menos 3 caracteres" }),
    email: z.email({ error: "El correo electrónico no es válido" }).trim(),
    password: z
      .string({ error: "La contraseña debe tener al menos 8 caracteres" })
      .trim()
      .min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value === true, {
      error: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;

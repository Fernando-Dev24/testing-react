import { describe, expect, it } from "vitest";
import { validatePassword } from "./validate-password";

describe("Validate password function", () => {
  const passwords: [string, boolean][] = [
    ["Abc123!@", true], // valido
    ["P@ssw0rd2024!#$%Abcd", true], // valido de 20 caracteres
    ["Ab1!567", false], // muy corta 7 caracteres
    ["Abc123!@Abc123!@Abc12", false], // muy larga 21 caracteres
    ["abc1234!", false], // sin mayuscula
    ["ABC1234!", false], // sin miniscula
    ["Abcdefg!", false], // sin numero
    ["Abc12345", false], // sin caracter especial
    ["Abc1234&", false], // caracter especial no permitido
    ["Abc 123!", false], // con espacios en blanco
    ["Abc\t123!", false], // con tabulacion
  ];

  it.each(passwords)(
    "should return true or false validate '%s'",
    (password, expected) => {
      expect(validatePassword(password)).toBe(expected);
    },
  );
});

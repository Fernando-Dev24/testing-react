const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%])[^\s]{8,20}$/;

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

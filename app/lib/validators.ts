const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

// PhoneField submits "{code} {number}" — validate the national number portion.
export function isValidPhoneNumber(value: string) {
  const spaceIndex = value.indexOf(" ");
  const number = spaceIndex > -1 ? value.slice(spaceIndex + 1) : value;
  const digits = number.replace(/\D/g, "");
  return digits.length >= 7;
}

export function isPositiveNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

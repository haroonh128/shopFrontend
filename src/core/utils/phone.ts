import * as Yup from "yup";

/** Pakistani phone: +92... or 03..., with 9–13 digits total. */
export const PHONE_NUMBER_MESSAGE =
  "Phone number must be 9–13 digits and start with +92 or 03";

export function isValidPhoneNumber(value: string | undefined | null): boolean {
  if (!value) return false;
  if (!/^(\+92|03)\d*$/.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 9 && digitCount <= 13;
}

/** Required phone field (registration, login, admin create). */
export const requiredPhoneSchema = () =>
  Yup.string()
    .required("Phone number is required")
    .test("phone-format", PHONE_NUMBER_MESSAGE, (v) => isValidPhoneNumber(v));

/** WhatsApp wa.me number: 03… becomes 92…, +92 stays 92…. */
export function toWhatsAppNumber(value: string | undefined | null): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 11 && digits.length <= 13) return digits;
  if (digits.startsWith("0") && digits.length >= 10 && digits.length <= 12) return `92${digits.slice(1)}`;
  return null;
}

export function whatsAppUrl(phone: string | undefined | null, message: string): string | null {
  const number = toWhatsAppNumber(phone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Optional phone field — empty allowed; if present must match format. */
export const optionalPhoneSchema = () =>
  Yup.string().test(
    "phone-format",
    PHONE_NUMBER_MESSAGE,
    (v) => !v || isValidPhoneNumber(v)
  );

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

/** Optional phone field — empty allowed; if present must match format. */
export const optionalPhoneSchema = () =>
  Yup.string().test(
    "phone-format",
    PHONE_NUMBER_MESSAGE,
    (v) => !v || isValidPhoneNumber(v)
  );

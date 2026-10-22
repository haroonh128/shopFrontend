export const formatCurrency = (value?: number | null) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "Rs. 0.00";
  return `Rs. ${amount.toFixed(2)}`;
};

export const calculateBmi = (heightCm?: number | null, weightKg?: number | null) => {
  const h = Number(heightCm);
  const w = Number(weightKg);
  if (!h || !w || h <= 0 || w <= 0) return null;
  const meters = h / 100;
  return Math.round((w / (meters * meters)) * 100) / 100;
};

/** Values match API JsonStringEnumConverter (camelCase). */
export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Other", value: "other" },
];

export const bloodGroupOptions = [
  { label: "Unknown", value: "unknown" },
  { label: "A+", value: "aPositive" },
  { label: "A-", value: "aNegative" },
  { label: "B+", value: "bPositive" },
  { label: "B-", value: "bNegative" },
  { label: "AB+", value: "abPositive" },
  { label: "AB-", value: "abNegative" },
  { label: "O+", value: "oPositive" },
  { label: "O-", value: "oNegative" },
];

const optionLabel = (
  options: { label: string; value: string }[],
  value?: string | null,
  fallback = "—"
) => {
  if (value == null || value === "") return fallback;
  const normalized = String(value).toLowerCase();
  const match = options.find((o) => o.value.toLowerCase() === normalized);
  return match?.label ?? value;
};

export const genderLabel = (value?: string | null) => optionLabel(genderOptions, value);

export const bloodGroupLabel = (value?: string | null) => optionLabel(bloodGroupOptions, value);

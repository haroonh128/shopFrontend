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

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const maritalStatusOptions = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
  { label: "Divorced", value: "Divorced" },
  { label: "Widowed", value: "Widowed" },
  { label: "Other", value: "Other" },
];

export const bloodGroupOptions = [
  { label: "Unknown", value: "Unknown" },
  { label: "A+", value: "APositive" },
  { label: "A-", value: "ANegative" },
  { label: "B+", value: "BPositive" },
  { label: "B-", value: "BNegative" },
  { label: "AB+", value: "ABPositive" },
  { label: "AB-", value: "ABNegative" },
  { label: "O+", value: "OPositive" },
  { label: "O-", value: "ONegative" },
];

export const bloodGroupLabel = (value?: string | null) => {
  const match = bloodGroupOptions.find((o) => o.value === value);
  return match?.label ?? value ?? "—";
};

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import type { Patient } from "../models/clinic.models";
import {
  bloodGroupOptions,
  calculateBmi,
  genderOptions,
  maritalStatusOptions,
} from "../utils/clinic.utils";

type Props = {
  initialValues?: Partial<Patient>;
  onSubmit: (values: Patient) => Promise<void> | void;
  onCancel?: () => void;
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Patient name is required"),
  gender: Yup.string().required("Gender is required"),
  contactNumber: Yup.string().nullable(),
  dateOfBirth: Yup.date()
    .nullable()
    .max(new Date(), "Date of birth cannot be in the future"),
  height: Yup.number().nullable().min(0.01, "Height must be positive"),
  weight: Yup.number().nullable().min(0.01, "Weight must be positive"),
  bmi: Yup.number().nullable().min(0.01, "BMI must be positive"),
});

const defaults: Patient = {
  fullName: "",
  gender: "Male",
  contactNumber: "",
  alternateContactNumber: "",
  email: "",
  address: "",
  allergies: "",
  notes: "",
  active: true,
};

export default function PatientForm({ initialValues, onSubmit, onCancel }: Props) {
  const formInitialValues: Patient = { ...defaults, ...initialValues };

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <Formik
        initialValues={formInitialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold">
                {values.id ? "Edit Patient" : "Register Patient"}
                {values.mrNumber ? ` — ${values.mrNumber}` : ""}
              </h1>
              {onCancel && (
                <button type="button" className="pi pi-arrow-left icon-action" title="Back" onClick={onCancel} />
              )}
            </div>

            <h2 className="text-lg font-semibold mt-2 mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field name="fullName">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Full Name *</label>
                    <InputText {...field} className="form-input w-full" />
                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <div>
                <label className="form-input-label">Gender *</label>
                <Dropdown
                  value={values.gender}
                  options={genderOptions}
                  onChange={(e) => setFieldValue("gender", e.value)}
                  className="form-input"
                />
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>
              <Field name="dateOfBirth">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Date of Birth</label>
                    <InputText {...field} type="date" value={field.value?.slice?.(0, 10) || field.value || ""} className="form-input w-full" />
                    <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <div>
                <label className="form-input-label">Marital Status</label>
                <Dropdown
                  value={values.maritalStatus}
                  options={maritalStatusOptions}
                  showClear
                  onChange={(e) => setFieldValue("maritalStatus", e.value)}
                  className="form-input"
                />
              </div>
              <Field name="contactNumber">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Contact Number</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="alternateContactNumber">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Alternate Contact</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="email">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Email</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <div>
                <label className="form-input-label">Blood Group</label>
                <Dropdown
                  value={values.bloodGroup}
                  options={bloodGroupOptions}
                  showClear
                  onChange={(e) => setFieldValue("bloodGroup", e.value)}
                  className="form-input"
                />
              </div>
              <Field name="address">
                {({ field }: any) => (
                  <div className="md:col-span-2">
                    <label className="form-input-label">Address</label>
                    <InputTextarea {...field} rows={2} className="form-input w-full" />
                  </div>
                )}
              </Field>
            </div>

            <h2 className="text-lg font-semibold mt-4 mb-2">Physical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Field name="height">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Height (cm)</label>
                    <InputText
                      {...field}
                      type="number"
                      className="form-input w-full"
                      onChange={(e) => {
                        const height = e.target.value === "" ? null : Number(e.target.value);
                        setFieldValue("height", height);
                        setFieldValue("bmi", calculateBmi(height, values.weight));
                      }}
                    />
                    <ErrorMessage name="height" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="weight">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Weight (kg)</label>
                    <InputText
                      {...field}
                      type="number"
                      className="form-input w-full"
                      onChange={(e) => {
                        const weight = e.target.value === "" ? null : Number(e.target.value);
                        setFieldValue("weight", weight);
                        setFieldValue("bmi", calculateBmi(values.height, weight));
                      }}
                    />
                    <ErrorMessage name="weight" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="bmi">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">BMI (optional)</label>
                    <InputText {...field} type="number" className="form-input w-full" />
                    <ErrorMessage name="bmi" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  label="Calculate BMI"
                  className="form-button-secondary w-full"
                  onClick={() => setFieldValue("bmi", calculateBmi(values.height, values.weight))}
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-4 mb-2">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field name="allergies">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Known Allergies</label>
                    <InputTextarea {...field} rows={2} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="notes">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Notes</label>
                    <InputTextarea {...field} rows={2} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="emergencyContactName">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Emergency Contact Name</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="emergencyContactNumber">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Emergency Contact Number</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
            </div>

            <div className="flex gap-2 mt-4">
              <Button type="submit" label={isSubmitting ? "Saving..." : "Save Patient"} className="form-button-primary" disabled={isSubmitting} />
              {onCancel && (
                <Button type="button" label="Back" className="form-button-secondary" onClick={onCancel} />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

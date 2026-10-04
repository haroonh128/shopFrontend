import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import type { Doctor } from "../models/clinic.models";
import { formatCurrency } from "../utils/clinic.utils";

type Props = {
  initialValues?: Partial<Doctor>;
  onSubmit: (values: Doctor) => Promise<void> | void;
  onCancel?: () => void;
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Doctor name is required"),
  defaultConsultationFee: Yup.number().min(0, "Fee cannot be negative").required("Fee is required"),
});

const defaults: Doctor = {
  fullName: "",
  qualifications: "",
  specialization: "",
  registrationNumber: "",
  phone: "",
  email: "",
  address: "",
  defaultConsultationFee: 0,
  active: true,
};

export default function DoctorForm({ initialValues, onSubmit, onCancel }: Props) {
  const formInitialValues: Doctor = { ...defaults, ...initialValues };

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
              <h1 className="text-2xl font-bold">{values.id ? "Edit Doctor" : "Add Doctor"}</h1>
              {onCancel && (
                <button type="button" className="pi pi-arrow-left icon-action" title="Back" onClick={onCancel} />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field name="fullName">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Full Name</label>
                    <InputText {...field} className="form-input w-full" />
                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="qualifications">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Qualifications</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="specialization">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Specialization</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="registrationNumber">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Registration Number</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <Field name="phone">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Phone</label>
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
              <Field name="defaultConsultationFee">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Default Consultation Fee</label>
                    <InputText
                      {...field}
                      type="number"
                      min={0}
                      step="0.01"
                      className="form-input w-full"
                      onChange={(e) => setFieldValue("defaultConsultationFee", Number(e.target.value))}
                    />
                    <div className="text-sm text-slate-500 mt-1">
                      Preview: {formatCurrency(values.defaultConsultationFee)}
                    </div>
                    <ErrorMessage name="defaultConsultationFee" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <div>
                <label className="form-input-label">Active</label>
                <Dropdown
                  value={values.active}
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  onChange={(e) => setFieldValue("active", e.value)}
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
            <div className="flex gap-2 mt-4">
              <Button type="submit" label={isSubmitting ? "Saving..." : "Save"} className="form-button-primary" disabled={isSubmitting} />
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

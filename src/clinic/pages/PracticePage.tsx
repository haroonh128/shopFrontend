import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import type { Practice } from "../models/clinic.models";
import { getCurrentPractice, updateCurrentPractice } from "../services/clinic.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Practice name is required"),
});

export default function PracticePage() {
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setPractice(await getCurrentPractice());
      } catch {
        setPractice(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-slate-500">Loading practice...</div>;
  if (!practice) return <div className="p-6 text-slate-500">Unable to load practice.</div>;

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Practice Settings</h1>
        <button
          type="button"
          className="pi pi-arrow-left icon-action"
          title="Back"
          onClick={() => navigate("/clinic/patients")}
        />
      </div>
      <Formik
        initialValues={practice}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updated = await updateCurrentPractice(values);
            setPractice(updated);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field name="name">
              {({ field }: any) => (
                <div>
                  <label className="form-input-label">Practice Name</label>
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
            <Field name="website">
              {({ field }: any) => (
                <div>
                  <label className="form-input-label">Website</label>
                  <InputText {...field} className="form-input w-full" />
                </div>
              )}
            </Field>
            <Field name="address">
              {({ field }: any) => (
                <div className="md:col-span-2">
                  <label className="form-input-label">Address</label>
                  <InputTextarea {...field} rows={3} className="form-input w-full" />
                </div>
              )}
            </Field>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" label={isSubmitting ? "Saving..." : "Save Practice"} className="form-button-primary" disabled={isSubmitting} />
              <Button
                type="button"
                label="Back"
                className="form-button-secondary"
                onClick={() => navigate("/clinic/patients")}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

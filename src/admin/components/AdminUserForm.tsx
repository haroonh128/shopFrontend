import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { MODULES } from "../../authentication/config/modules";
import type { AdminUserFormValues } from "../models/admin.models";

type Props = {
  initialValues?: Partial<AdminUserFormValues>;
  onSubmit: (values: AdminUserFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

const moduleOptions = [
  { label: "None", value: "" },
  ...MODULES.filter((m) => m.id !== "admin-panel").map((m) => ({
    label: m.title,
    value: m.id,
  })),
];

const defaults: AdminUserFormValues = {
  phoneNumber: "",
  pin: "",
  confirmPin: "",
  firstName: "",
  lastName: "",
  email: "",
  cnic: "",
  appType: "",
  moduleId: "",
  isTwoFactorEnabled: false,
  isActive: true,
  isAdmin: false,
  subscriptionValidUntil: "",
};

export default function AdminUserForm({ initialValues, onSubmit, onCancel }: Props) {
  const isEdit = Boolean(initialValues?.id);
  const formInitialValues: AdminUserFormValues = { ...defaults, ...initialValues };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string().min(12, "Phone number must be 12-13 digits").required("Phone number is required"),
    pin: isEdit
      ? Yup.string().test("pin-length", "PIN must be 4 digits", (v) => !v || v.length === 4)
      : Yup.string().length(4, "PIN must be 4 digits").required("PIN is required"),
    confirmPin: Yup.string().when("pin", {
      is: (pin: string) => Boolean(pin),
      then: (schema) =>
        schema
          .required("Confirm PIN is required")
          .oneOf([Yup.ref("pin")], "PINs must match"),
      otherwise: (schema) => schema.notRequired(),
    }),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    cnic: Yup.string().required("CNIC is required"),
  });

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
              <h1 className="text-2xl font-bold">{isEdit ? "Edit User" : "Create User"}</h1>
              {onCancel && (
                <button
                  type="button"
                  className="pi pi-arrow-left icon-action"
                  title="Back"
                  onClick={onCancel}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field name="firstName">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">First Name</label>
                    <InputText {...field} className="form-input w-full" />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="lastName">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Last Name</label>
                    <InputText {...field} className="form-input w-full" />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="phoneNumber">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Phone Number</label>
                    <InputText {...field} className="form-input w-full" placeholder="+92xxxxxxxxxx" />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="email">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Email</label>
                    <InputText {...field} type="email" className="form-input w-full" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="cnic">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">CNIC</label>
                    <InputText {...field} className="form-input w-full" />
                    <ErrorMessage name="cnic" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="appType">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">App Type</label>
                    <InputText {...field} className="form-input w-full" />
                  </div>
                )}
              </Field>
              <div>
                <label className="form-input-label">Module</label>
                <Dropdown
                  value={values.moduleId}
                  options={moduleOptions}
                  onChange={(e) => setFieldValue("moduleId", e.value ?? "")}
                  className="form-input"
                  placeholder="Select module"
                />
              </div>
              <div>
                <label className="form-input-label">Subscription Valid Until</label>
                <InputText
                  type="date"
                  value={values.subscriptionValidUntil || ""}
                  onChange={(e) => setFieldValue("subscriptionValidUntil", e.target.value)}
                  className="form-input w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Extend this date when the user pays the monthly subscription.
                </p>
              </div>
              <Field name="pin">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">
                      {isEdit ? "New PIN (optional)" : "PIN"}
                    </label>
                    <InputText {...field} type="password" maxLength={4} className="form-input w-full" />
                    <ErrorMessage name="pin" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
              <Field name="confirmPin">
                {({ field }: any) => (
                  <div>
                    <label className="form-input-label">Confirm PIN</label>
                    <InputText {...field} type="password" maxLength={4} className="form-input w-full" />
                    <ErrorMessage name="confirmPin" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </Field>
            </div>

            <div className="flex flex-wrap gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.isActive}
                  onChange={(e) => setFieldValue("isActive", Boolean(e.checked))}
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.isAdmin}
                  onChange={(e) => setFieldValue("isAdmin", Boolean(e.checked))}
                />
                <span>Admin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.isTwoFactorEnabled}
                  onChange={(e) => setFieldValue("isTwoFactorEnabled", Boolean(e.checked))}
                />
                <span>Two-factor auth</span>
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                type="submit"
                label={isEdit ? "Save changes" : "Create user"}
                className="form-button-primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

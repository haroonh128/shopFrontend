import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export interface ResetPasswordFormValues {
  otpCode: string;
  newPin: string;
  confirmNewPin: string;
}

interface Props {
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
}

const schema = Yup.object({
  otpCode: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP code is required"),
  newPin: Yup.string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required("New PIN is required"),
  confirmNewPin: Yup.string()
    .oneOf([Yup.ref("newPin")], "PINs must match")
    .required("Confirm PIN is required"),
});

export default function ResetPasswordForm({ onSubmit }: Props) {
  return (
    <Formik<ResetPasswordFormValues>
      initialValues={{ otpCode: "", newPin: "", confirmNewPin: "" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reset code
            </label>
            <Field name="otpCode">
              {({ field }: any) => (
                <InputText
                  {...field}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.otpCode && touched.otpCode
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.otpCode && touched.otpCode ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.otpCode}
              </small>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              New PIN
            </label>
            <Field name="newPin">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={4}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.newPin && touched.newPin
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.newPin && touched.newPin ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.newPin}
              </small>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm new PIN
            </label>
            <Field name="confirmNewPin">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={4}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.confirmNewPin && touched.confirmNewPin
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.confirmNewPin && touched.confirmNewPin ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.confirmNewPin}
              </small>
            ) : null}
          </div>

          <Button
            type="submit"
            label="Reset PIN"
            loading={isSubmitting}
            className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          />
        </Form>
      )}
    </Formik>
  );
}

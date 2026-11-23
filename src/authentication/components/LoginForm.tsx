import { useState } from "react";
import { Formik, Form, Field, type FieldProps } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { requiredPhoneSchema } from "../../core/utils/phone";

interface LoginFormValues {
  phoneNumber: string;
  pin: string;
}

interface Props {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

const schema = Yup.object({
  phoneNumber: requiredPhoneSchema(),
  pin: Yup.string().required("Pin is required")
});

export default function LoginForm({ onSubmit }: Props) {
  const [pinVisible, setPinVisible] = useState(false);

  return (
    <Formik<LoginFormValues>
      initialValues={{ phoneNumber: "", pin: "" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <Field name="phoneNumber">
              {({ field }: any) => (
                <InputText
                  {...field}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+92... or 03..."
                  maxLength={14}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.phoneNumber && touched.phoneNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.phoneNumber && touched.phoneNumber ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.phoneNumber}
              </small>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="pin"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Pin
            </label>
            <Field name="pin">
              {({ field }: FieldProps<string>) => (
                <div className="relative">
                  <InputText
                    {...field}
                    id="pin"
                    type={pinVisible ? "text" : "password"}
                    autoComplete="current-password"
                    className={[
                      "w-full rounded-md border px-3 py-2 pr-10 text-slate-900 outline-none",
                      "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                      errors.pin && touched.pin
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    onClick={() => setPinVisible((visible) => !visible)}
                    aria-label={pinVisible ? "Hide pin" : "Show pin"}
                    aria-pressed={pinVisible}
                  >
                    <i
                      className={pinVisible ? "pi pi-eye-slash" : "pi pi-eye"}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </Field>
            {errors.pin && touched.pin ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.pin}
              </small>
            ) : null}
          </div>

          <Button
            type="submit"
            label="Login"
            className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          />
        </Form>
      )}
    </Formik>
  );
}

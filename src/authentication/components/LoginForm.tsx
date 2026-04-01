import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface LoginFormValues {
  phoneNumber: string;
  pin: string;
}

interface Props {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

const schema = Yup.object({
  phoneNumber: Yup.string().required("Phone number is required"),
  pin: Yup.string().required("Pin is required")
});

export default function LoginForm({ onSubmit }: Props) {
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Pin
            </label>
            <Field name="pin">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.pin && touched.pin
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
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

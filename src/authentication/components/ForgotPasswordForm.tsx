import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export interface ForgotPasswordFormValues {
  email: string;
}

interface Props {
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
}

const schema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export default function ForgotPasswordForm({ onSubmit }: Props) {
  return (
    <Formik<ForgotPasswordFormValues>
      initialValues={{ email: "" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Field name="email">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.email && touched.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.email && touched.email ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.email}
              </small>
            ) : null}
          </div>

          <Button
            type="submit"
            label="Send reset code"
            loading={isSubmitting}
            className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          />
        </Form>
      )}
    </Formik>
  );
}

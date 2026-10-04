import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { registrationFormValues } from "../models/registration.model";
import { MODULES, ADMIN_MODULE_ID } from "../config/modules";

const moduleOptions = MODULES.filter((m) => m.id !== ADMIN_MODULE_ID).map((m) => ({
  label: m.title,
  value: m.id,
}));

const formSchema = Yup.object({
    phoneNumber: Yup.string().min(12, 'Phone number must be 13 digits').required('Phone number is required'),
    pin: Yup.string().min(4, 'Pin hash must be 4 digits').required('Pin hash is required'),
    confirmPin: Yup.string().min(4, 'Confirm pin must be 4 digits').required('Confirm pin is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    isTwoFactorEnabled: Yup.boolean().required('Is two factor enabled is required'),
    cnic: Yup.string().required('Cnic is required'),
    appType: Yup.string(),
    moduleId: Yup.string().required('Module is required'),
});
export default function RegistrationForm({ onSubmit }: { onSubmit: (values: registrationFormValues) => void }) {
    return (
    <Formik<registrationFormValues>
      initialValues={{ phoneNumber: '', pin: '', confirmPin: '', firstName: '', lastName: '', email: '', isTwoFactorEnabled: false, cnic: '', appType: 'web', moduleId: '' }}
      validationSchema={formSchema}
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
                  inputMode="numeric"
                  autoComplete="tel"
                  minLength={12}
                  maxLength={13}
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
              Pin Hash
            </label>
            <Field name="pin">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  minLength={4}
                  inputMode="numeric"
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
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm Pin
            </label>
            <Field name="confirmPin">
              {({ field }: any) => (
                <InputText
                  {...field}
                  type="password"
                  minLength={4}
                  inputMode="numeric"
                  autoComplete="current-password"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.confirmPin && touched.confirmPin
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.confirmPin && touched.confirmPin ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.confirmPin}
              </small>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              First Name
            </label>
            <Field name="firstName">
              {({ field }: any) => (
                <InputText
                  {...field}
                  autoComplete="given-name"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.firstName && touched.firstName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.firstName && touched.firstName ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.firstName}
              </small>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <Field name="lastName">
              {({ field }: any) => (
                <InputText
                  {...field}
                  autoComplete="family-name"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.lastName && touched.lastName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.lastName && touched.lastName ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.lastName}
              </small>
            ) : null}
          </div>
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
          <div className="flex items-center gap-2">
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="isTwoFactorEnabled">
              Is Two Factor Enabled
            </label>
            <Field name="isTwoFactorEnabled">
              {({ field, form }: any) => (
                <Checkbox
                  id="isTwoFactorEnabled"
                  inputId="isTwoFactorEnabled"
                  name={field.name}
                  checked={Boolean(field.value)}
                  onChange={(e) => form.setFieldValue(field.name, Boolean(e.checked))}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  className="w-4 h-4"
                />
              )}
            </Field>
            {errors.isTwoFactorEnabled && touched.isTwoFactorEnabled ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.isTwoFactorEnabled}
              </small>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              CNIC
            </label>
            <Field name="cnic">
              {({ field }: any) => (
                <InputText
                  {...field}
                  autoComplete="off"
                  maxLength={13}
                  minLength={13}
                  inputMode="numeric"
                  className={[
                    "w-full rounded-md border px-3 py-2 text-slate-900 outline-none",
                    "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    errors.cnic && touched.cnic
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "",
                  ].join(" ")}
                />
              )}
            </Field>
            {errors.cnic && touched.cnic ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.cnic}
              </small>
            ) : null}
          </div>
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Module
            </label>
            <Field name="moduleId">
              {({ field, form }: any) => (
                <Dropdown
                  id="moduleId"
                  value={field.value}
                  onChange={(e) => form.setFieldValue(field.name, e.value ?? '')}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  options={moduleOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Module"
                  className={[
                    "form-input",
                    errors.moduleId && touched.moduleId ? "p-invalid" : "",
                  ].join(" ")}
                  filter
                  showClear
                />
              )}
            </Field>
            {errors.moduleId && touched.moduleId ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.moduleId}
              </small>
            ) : null}
          </div>
          {/* <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              App Type
            </label>
            <Field name="appType">
              {({ field, form }: any) => (
                <Dropdown
                  id="appType"
                  value={field.value}
                  onChange={(e) => form.setFieldValue(field.name, e.value ?? '')}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  options={[
                    { label: 'Windows', value: 'windows' },
                    { label: 'Web', value: 'web' }
                  ]}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select App Type"
                  className="w-full"
                  filter
                  showClear
                />
              )}
            </Field>
            {errors.appType && touched.appType ? (
              <small className="mt-1 block text-sm text-red-600">
                {errors.appType}
              </small>
            ) : null}
          </div> */}
          <Button
            type="submit"
            label="Register"
            className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          />
        </Form>
      )}
    </Formik>
  );
}
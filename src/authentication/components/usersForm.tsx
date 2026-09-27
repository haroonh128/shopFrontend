import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { userFormValues } from "../models/user.model";

const genderOptions = [
    { label: "Male", value: "0" },
    { label: "Female", value: "1" },
    { label: "Other", value: "2" },
];

type UsersFormProps = {
    initialValues?: Partial<userFormValues>;
    onSubmit: (values: userFormValues) => Promise<void> | void;
    onCancel?: () => void;
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters long"),
    phone: Yup.string().required("Phone is required").min(10, "Phone must be at least 10 characters long"),
    address: Yup.string().required("Address is required").min(20, "Address must be at least 20 characters long"),
    gender: Yup.string().required("Gender is required"),
    description: Yup.string().required("Description is required").min(100, "Description must be at least 100 characters long"),
    active: Yup.boolean().required("Active is required"),
    moduleId: Yup.string(),
    isDeleted: Yup.boolean(),
});

const defaultValues: userFormValues = {
    name: "",
    phone: "",
    address: "",
    gender: "",
    description: "",
    active: true,
    moduleId: "",
    isDeleted: false,
};

export default function UsersForm({ initialValues, onSubmit, onCancel }: UsersFormProps) {

    const formInitialValues: userFormValues = {
        ...defaultValues,
        ...initialValues
    };

    return (
        <div className="card p-6 border-2 border-gray-300 rounded-md">
            <Formik
                initialValues={formInitialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        await onSubmit(values);
                        if (!values.id) {
                            resetForm();
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <div className="flex flex-col gap-2 mt-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h1 className="text-2xl font-bold">{values.id ? "Edit User" : "Add User"}</h1>
                                {onCancel && (
                                    <button
                                        type="button"
                                        className="pi pi-arrow-left icon-action"
                                        title="Back"
                                        disabled={isSubmitting}
                                        onClick={onCancel}
                                    />
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Field name="name">
                                    {({ field }: any) => (
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-input-label">Name</label>
                                            <InputText
                                                {...field}
                                                id="name"
                                                name="name"
                                                className="form-input"
                                                placeholder="Enter name"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                            
                                <Field name="phone">
                                    {({ field }: any) => (
                                        <div className="mb-2">
                                            <label htmlFor="phone" className="form-input-label">Phone</label>
                                            <InputText
                                                {...field}
                                                id="phone"
                                                autoComplete="off"
                                                type="tel"
                                                name="phone"
                                                placeholder="Enter phone number"
                                                className="form-input"
                                            />
                                            <ErrorMessage name="phone" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                <Field name="address">
                                    {({ field }: any) => (
                                        <div className="mb-2">
                                            <label htmlFor="address" className="form-input-label">Address</label>
                                            <InputText
                                                {...field}
                                                id="address"
                                                name="address"
                                                placeholder="Enter address"
                                                className="form-input"
                                            />
                                            <ErrorMessage name="address" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="gender" className="form-input-label">Gender</label>
                                    <Dropdown
                                        id="gender"
                                        name="gender"
                                        value={values.gender || null}
                                        onChange={(e) => setFieldValue("gender", e.value ?? "")}
                                        onBlur={() => setFieldTouched("gender", true)}
                                        options={genderOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Select gender"
                                        className="form-input"
                                        showClear
                                    />
                                    <ErrorMessage name="gender" component="div" className="text-red-500" />
                                </div>
                                <Field name="description">
                                    {({ field }: any) => (
                                        <div className="mb-2">
                                            <label htmlFor="description" className="form-input-label">Description</label>
                                            <InputText
                                                {...field}
                                                id="description"
                                                name="description"
                                                placeholder="Enter description"
                                                className="form-input"
                                            />
                                            <ErrorMessage name="description" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="mb-2">
                                    <label htmlFor="active">Active</label>
                                    <InputSwitch
                                        id="active"
                                        name="active"
                                        checked={values.active}
                                        onChange={(e) => setFieldValue("active", e.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="isDeleted">Is deleted</label>
                                    <InputSwitch
                                        id="isDeleted"
                                        name="isDeleted"
                                        checked={values.isDeleted}
                                        onChange={(e) => setFieldValue("isDeleted", e.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="form-button-primary"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {values.id ? "Update" : "Submit"}
                                </Button>
                                {onCancel && (
                                    <Button
                                        type="button"
                                        label="Back"
                                        className="form-button-secondary"
                                        disabled={isSubmitting}
                                        onClick={onCancel}
                                    />
                                )}
                            </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

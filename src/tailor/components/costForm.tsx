import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { costFormValues, pendingAmount, formatMoney } from "../models/cost.model";

type ClientOption = { label: string; value: string };

type CostFormProps = {
    initialValues?: Partial<costFormValues>;
    clientOptions: ClientOption[];
    lockClient?: boolean;
    onSubmit: (values: costFormValues) => Promise<void> | void;
    onCancel?: () => void;
};

const defaultValues: costFormValues = {
    clientId: "",
    measurementId: "",
    totalCost: 0,
    advance: 0,
    notes: "",
};

const validationSchema = Yup.object({
    clientId: Yup.string().required("Client is required"),
    totalCost: Yup.number()
        .typeError("Total cost is required")
        .min(0, "Total cost cannot be negative")
        .required("Total cost is required"),
    advance: Yup.number()
        .typeError("Advance is required")
        .min(0, "Advance cannot be negative")
        .required("Advance is required")
        .test("lte-total", "Advance cannot exceed total cost", function (value) {
            const total = Number(this.parent.totalCost || 0);
            return Number(value || 0) <= total;
        }),
    notes: Yup.string(),
});

export default function CostForm({
    initialValues,
    clientOptions,
    lockClient = false,
    onSubmit,
    onCancel,
}: CostFormProps) {
    const formInitialValues: costFormValues = {
        ...defaultValues,
        ...initialValues,
        measurementId: initialValues?.measurementId ?? defaultValues.measurementId,
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
                {({ isSubmitting, values, setFieldValue, setFieldTouched }) => {
                    const pending = pendingAmount(values.totalCost, values.advance);

                    return (
                        <Form>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex justify-start">
                                    <h1 className="text-2xl font-bold">
                                        {values.id ? "Edit Cost" : "Add Cost"}
                                    </h1>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="mb-2">
                                        <label htmlFor="clientId" className="form-input-label">Client</label>
                                        <Dropdown
                                            id="clientId"
                                            name="clientId"
                                            value={values.clientId || null}
                                            onChange={(e) => setFieldValue("clientId", e.value ?? "")}
                                            onBlur={() => setFieldTouched("clientId", true)}
                                            options={clientOptions}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Select client"
                                            className="form-input"
                                            filter
                                            showClear={!lockClient}
                                            disabled={lockClient}
                                        />
                                        <ErrorMessage name="clientId" component="div" className="text-red-500" />
                                    </div>

                                    <Field name="totalCost">
                                        {({ field }: any) => (
                                            <div className="mb-2">
                                                <label htmlFor="totalCost" className="form-input-label">Total Cost</label>
                                                <InputText
                                                    id="totalCost"
                                                    name="totalCost"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    className="form-input"
                                                    value={field.value === 0 || field.value ? String(field.value) : ""}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        setFieldValue("totalCost", raw === "" ? 0 : Number(raw));
                                                    }}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter total cost"
                                                />
                                                <ErrorMessage name="totalCost" component="div" className="text-red-500" />
                                            </div>
                                        )}
                                    </Field>

                                    <Field name="advance">
                                        {({ field }: any) => (
                                            <div className="mb-2">
                                                <label htmlFor="advance" className="form-input-label">Advance</label>
                                                <InputText
                                                    id="advance"
                                                    name="advance"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    className="form-input"
                                                    value={field.value === 0 || field.value ? String(field.value) : ""}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        setFieldValue("advance", raw === "" ? 0 : Number(raw));
                                                    }}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter advance received"
                                                />
                                                <ErrorMessage name="advance" component="div" className="text-red-500" />
                                            </div>
                                        )}
                                    </Field>

                                    <div className="mb-2">
                                        <label htmlFor="pending" className="form-input-label">Pending</label>
                                        <InputText
                                            id="pending"
                                            name="pending"
                                            className="form-input"
                                            value={formatMoney(pending)}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-2 md:col-span-2">
                                        <label htmlFor="notes" className="form-input-label">Notes</label>
                                        <Field name="notes">
                                            {({ field }: any) => (
                                                <InputTextarea
                                                    {...field}
                                                    id="notes"
                                                    rows={3}
                                                    className="form-input w-full"
                                                    placeholder="Optional notes"
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
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
                                            className="form-button-secondary"
                                            disabled={isSubmitting}
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

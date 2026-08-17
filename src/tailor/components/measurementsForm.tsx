import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import {
    BOOLEAN_FIELDS,
    DRESS_TYPE_OPTIONS,
    FIELD_LABELS,
    SELECT_FIELDS,
    getSelectOptions,
    isFieldVisible,
    measurementFormValues,
    MeasurementField,
} from "../models/measurement.model";

type ClientOption = { label: string; value: string };

type MeasurementsFormProps = {
    initialValues?: Partial<measurementFormValues>;
    clientOptions: ClientOption[];
    onSubmit: (values: measurementFormValues) => Promise<void> | void;
    onCancel?: () => void;
};

const defaultValues: measurementFormValues = {
    clientId: "",
    type: "",
    length: 0,
    shoulder: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    neck: 0,
    armLength: 0,
    armRound: 0,
    bicep: 0,
    elbow: 0,
    wrist: 0,
    armOpening: 0,
    trouserLength: 0,
    inseam: 0,
    rise: 0,
    thigh: 0,
    knee: 0,
    calf: 0,
    ankle: 0,
    bottom: 0,
    underBust: 0,
    bust: 0,
    neckDepthFront: 0,
    neckDepthBack: 0,
    sidePocket: false,
    frontPocket: false,
    backPocket: false,
    breastPocket: false,
    innerPocket: false,
    patchPocket: false,
    ticketPocket: false,
    elbowPatch: false,
    collarType: "",
    cuffType: "",
    fitType: "",
    trouserType: "",
    lapelStyle: "",
    neckStyle: "",
    armType: "",
    ventType: "",
    waistcoatType: "",
    riseType: "",
    hemType: "",
    frontPocketType: "",
    backPocketType: "",
    height: 0,
    weight: 0,
    notes: "",
};

const validationSchema = Yup.object({
    clientId: Yup.string().required("Client is required"),
    type: Yup.string().required("Dress type is required"),
    notes: Yup.string(),
});

const sectionTitle = (title: string) => (
    <h2 className="col-span-full text-lg font-semibold text-slate-700 mt-2 mb-1 border-b border-slate-200 pb-1">
        {title}
    </h2>
);

const visibleOf = (type: string, fields: MeasurementField[]) =>
    fields.filter((f) => isFieldVisible(type, f));

export default function MeasurementsForm({
    initialValues,
    clientOptions,
    onSubmit,
    onCancel,
}: MeasurementsFormProps) {
    const formInitialValues: measurementFormValues = {
        ...defaultValues,
        ...initialValues,
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
                    const type = values.type || "";
                    const upperFields = visibleOf(type, [
                        "length", "shoulder", "chest", "waist", "hip", "neck",
                        "bust", "underBust", "neckDepthFront", "neckDepthBack",
                    ]);
                    const armFields = visibleOf(type, [
                        "armLength", "armRound", "bicep", "elbow", "wrist", "armOpening",
                    ]);
                    const lowerFields = visibleOf(type, [
                        "trouserLength", "inseam", "rise", "thigh", "knee", "calf", "ankle", "bottom",
                    ]);
                    const pocketSelectFields = visibleOf(type, ["frontPocketType", "backPocketType"]);
                    const styleFields = visibleOf(
                        type,
                        SELECT_FIELDS.filter((f) => f !== "frontPocketType" && f !== "backPocketType")
                    );
                    const pocketFields = visibleOf(type, BOOLEAN_FIELDS);
                    const extraOptionFields = visibleOf(type, ["elbowPatch"]);
                    const metaNumberFields = visibleOf(type, ["height", "weight"]);
                    const showNotes = isFieldVisible(type, "notes");

                    const renderNumberField = (name: MeasurementField) => (
                        <Field key={name} name={name}>
                            {({ field }: any) => (
                                <div className="mb-2">
                                    <label htmlFor={name} className="form-input-label">
                                        {FIELD_LABELS[name]}
                                    </label>
                                    <InputText
                                        id={name}
                                        name={name}
                                        type="number"
                                        min={0}
                                        step="0.1"
                                        className="form-input"
                                        value={field.value === 0 || field.value ? String(field.value) : ""}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            setFieldValue(name, raw === "" ? 0 : Number(raw));
                                        }}
                                        onBlur={field.onBlur}
                                        placeholder={`Enter ${FIELD_LABELS[name].toLowerCase()}`}
                                    />
                                    <ErrorMessage name={name} component="div" className="text-red-500" />
                                </div>
                            )}
                        </Field>
                    );

                    const renderSelectField = (name: MeasurementField) => (
                        <div key={name} className="mb-2">
                            <label htmlFor={name} className="form-input-label">
                                {FIELD_LABELS[name]}
                            </label>
                            <Dropdown
                                id={name}
                                name={name}
                                value={(values as any)[name] || null}
                                onChange={(e) => setFieldValue(name, e.value ?? "")}
                                onBlur={() => setFieldTouched(name, true)}
                                options={getSelectOptions(name, type)}
                                optionLabel="label"
                                optionValue="value"
                                placeholder={`Select ${FIELD_LABELS[name].toLowerCase()}`}
                                className="form-input"
                                showClear
                            />
                            <ErrorMessage name={name} component="div" className="text-red-500" />
                        </div>
                    );

                    const renderBooleanField = (name: MeasurementField) => (
                        <div key={name} className="mb-2 flex items-center gap-3">
                            <InputSwitch
                                id={name}
                                name={name}
                                checked={Boolean((values as any)[name])}
                                onChange={(e) => setFieldValue(name, e.value)}
                            />
                            <label htmlFor={name} className="form-input-label mb-0">
                                {FIELD_LABELS[name]}
                            </label>
                        </div>
                    );

                    return (
                        <Form>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex justify-start">
                                    <h1 className="text-2xl font-bold">
                                        {values.id ? "Edit Measurement" : "Add Measurement"}
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
                                            showClear
                                        />
                                        <ErrorMessage name="clientId" component="div" className="text-red-500" />
                                    </div>

                                    <div className="mb-2">
                                        <label htmlFor="type" className="form-input-label">Dress Type</label>
                                        <Dropdown
                                            id="type"
                                            name="type"
                                            value={values.type || null}
                                            onChange={(e) => {
                                                const nextType = e.value ?? "";
                                                setFieldValue("type", nextType);
                                                if (
                                                    (nextType === "coat" || nextType === "suit") &&
                                                    values.collarType === "button_down"
                                                ) {
                                                    setFieldValue("collarType", "");
                                                }
                                            }}
                                            onBlur={() => setFieldTouched("type", true)}
                                            options={DRESS_TYPE_OPTIONS}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Select dress type"
                                            className="form-input"
                                            showClear
                                        />
                                        <ErrorMessage name="type" component="div" className="text-red-500" />
                                    </div>
                                </div>

                                {!type && (
                                    <p className="text-slate-500 text-sm py-4">
                                        Select a dress type to show the relevant measurement fields.
                                    </p>
                                )}

                                {upperFields.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Body Measurements")}
                                        {upperFields.map(renderNumberField)}
                                    </div>
                                )}

                                {armFields.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Arm Measurements")}
                                        {armFields.map(renderNumberField)}
                                    </div>
                                )}

                                {lowerFields.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Lower Body / Trouser")}
                                        {lowerFields.map(renderNumberField)}
                                    </div>
                                )}

                                {(styleFields.length > 0 || extraOptionFields.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Style Options")}
                                        {styleFields.map(renderSelectField)}
                                        {extraOptionFields.map(renderBooleanField)}
                                    </div>
                                )}

                                {(pocketSelectFields.length > 0 || pocketFields.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Pockets")}
                                        {pocketSelectFields.map(renderSelectField)}
                                        {pocketFields.map(renderBooleanField)}
                                    </div>
                                )}

                                {(metaNumberFields.length > 0 || showNotes) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {sectionTitle("Additional")}
                                        {metaNumberFields.map(renderNumberField)}
                                        {showNotes && (
                                            <div className="mb-2 md:col-span-3">
                                                <label htmlFor="notes" className="form-input-label">
                                                    {FIELD_LABELS.notes}
                                                </label>
                                                <Field name="notes">
                                                    {({ field }: any) => (
                                                        <InputTextarea
                                                            {...field}
                                                            id="notes"
                                                            rows={3}
                                                            className="form-input w-full"
                                                            placeholder="Any special instructions or notes"
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        )}
                                    </div>
                                )}

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

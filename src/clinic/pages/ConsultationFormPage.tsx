import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import type {
  ConsultationDetails,
  Doctor,
  Patient,
} from "../models/clinic.models";
import {
  createConsultation,
  getConsultationById,
  getDoctors,
  getPatientById,
  searchMedications,
  searchTests,
  updateConsultation,
} from "../services/clinic.service";
import { calculateBmi, formatCurrency, genderLabel } from "../utils/clinic.utils";
import ConsultationPrintView from "../components/ConsultationPrintView";
import PrescriptionPrintView from "../components/PrescriptionPrintView";

const validationSchema = Yup.object({
  doctorId: Yup.string().required("Doctor is required"),
  consultationFee: Yup.number().min(0, "Fee cannot be negative").required("Consultation fee is required"),
  chiefComplaint: Yup.string().nullable(),
});

const emptyConsultation = (patientId: string): ConsultationDetails => ({
  patientId,
  doctorId: "",
  visitDate: new Date().toISOString().slice(0, 16),
  chiefComplaint: "",
  history: "",
  examination: "",
  observations: "",
  diagnosisNotes: "",
  advice: "",
  followUpRequired: false,
  followUpDate: "",
  followUpNotes: "",
  consultationFee: 0,
  vitals: {
    temperature: null,
    systolicBP: null,
    diastolicBP: null,
    pulse: null,
    respiratoryRate: null,
    oxygenSaturation: null,
    height: null,
    weight: null,
    bmi: null,
  },
  diagnoses: [{ diagnosisName: "", isPrimary: true, notes: "" }],
  tests: [],
  prescription: {
    prescriptionDate: new Date().toISOString(),
    notes: "",
    items: [{ medicationName: "", strength: "", dosage: "", frequency: "", duration: "", instructions: "", sortOrder: 0 }],
  },
});

export default function ConsultationFormPage() {
  const { patientId, id } = useParams<{ patientId?: string; id?: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [initial, setInitial] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<"none" | "consultation" | "prescription">("none");
  const [saved, setSaved] = useState<ConsultationDetails | null>(null);
  const [dirtyWarn, setDirtyWarn] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const doctorList = await getDoctors();
      const activeDoctors = (Array.isArray(doctorList) ? doctorList : []).filter((d) => d.active !== false);
      setDoctors(activeDoctors);

      if (id) {
        const details = await getConsultationById(id);
        const p = await getPatientById(details.patientId);
        setPatient(p);
        setInitial({
          ...details,
          visitDate: details.visitDate ? details.visitDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
          followUpDate: details.followUpDate ? details.followUpDate.slice(0, 10) : "",
          diagnoses: details.diagnoses?.length ? details.diagnoses : [{ diagnosisName: "", isPrimary: true }],
          tests: details.tests ?? [],
          prescription: details.prescription ?? {
            prescriptionDate: new Date().toISOString(),
            items: [{ medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }],
          },
          vitals: details.vitals ?? emptyConsultation(details.patientId).vitals,
        });
        setSaved(details);
      } else if (patientId) {
        const p = await getPatientById(patientId);
        setPatient(p);
        const base = emptyConsultation(patientId);
        base.vitals = {
          ...base.vitals!,
          height: p.height ?? null,
          weight: p.weight ?? null,
          bmi: p.bmi ?? calculateBmi(p.height, p.weight),
        };
        const linked = activeDoctors.find((d) => d.userId);
        const selected = linked || (activeDoctors.length === 1 ? activeDoctors[0] : undefined);
        if (selected?.id) {
          base.doctorId = selected.id;
          base.consultationFee = Number(selected.defaultConsultationFee || 0);
        }
        setInitial(base);
      }
    } catch {
      setInitial(null);
    } finally {
      setLoading(false);
    }
  }, [id, patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirtyWarn) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyWarn]);

  const doctorOptions = useMemo(
    () => doctors.map((d) => ({ label: `${d.fullName}${d.specialization ? ` (${d.specialization})` : ""}`, value: d.id! })),
    [doctors]
  );

  if (loading || !initial) {
    return <div className="p-6 text-slate-500">{loading ? "Loading consultation..." : "Unable to load consultation."}</div>;
  }

  if (printMode !== "none" && saved) {
    return (
      <div>
        <div className="no-print mb-3 flex gap-2">
          <button
            type="button"
            className="pi pi-arrow-left icon-action"
            title="Back"
            onClick={() => setPrintMode("none")}
          />
          <Button label="Print" className="form-button-primary" onClick={() => window.print()} />
        </div>
        {printMode === "consultation" ? (
          <ConsultationPrintView consultation={saved} patient={patient} />
        ) : (
          <PrescriptionPrintView consultation={saved} patient={patient} />
        )}
      </div>
    );
  }

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <Formik
        initialValues={initial}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload: ConsultationDetails = {
              ...values,
              visitDate: new Date(values.visitDate).toISOString(),
              followUpDate: values.followUpRequired && values.followUpDate ? new Date(values.followUpDate).toISOString() : null,
              diagnoses: (values.diagnoses || []).filter((d) => d.diagnosisName?.trim()),
              tests: (values.tests || []).filter((t) => t.testName?.trim()),
              prescription: {
                ...values.prescription!,
                prescriptionDate: values.prescription?.prescriptionDate || new Date().toISOString(),
                items: (values.prescription?.items || []).filter((i) => i.medicationName?.trim()),
              },
            };

            const result = values.id
              ? await updateConsultation(values.id, payload)
              : await createConsultation(payload);
            setSaved(result);
            setDirtyWarn(false);
            const returnPatientId = result.patientId || patient?.id || patientId;
            navigate(returnPatientId ? `/clinic/patients/${returnPatientId}` : "/clinic/patients");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, dirty }) => (
          <>
            <DirtyWatcher dirty={dirty} onDirtyChange={setDirtyWarn} />
            <Form>
              <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{values.id ? "Consultation" : "New Consultation"}</h1>
                  {patient && (
                    <div className="text-sm text-slate-600 mt-1">
                      {patient.fullName} · {patient.mrNumber} · {genderLabel(patient.gender)}
                      {patient.allergies ? ` · Allergies: ${patient.allergies}` : ""}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 no-print">
                  <Button type="submit" label={isSubmitting ? "Saving..." : "Save Consultation"} className="form-button-primary" disabled={isSubmitting} />
                  {values.id && (
                    <>
                      <Button type="button" label="Print Consultation" className="form-button-secondary" onClick={() => setPrintMode("consultation")} />
                      <Button type="button" label="Print Prescription" className="form-button-secondary" onClick={() => setPrintMode("prescription")} />
                    </>
                  )}
                  <Button
                    type="button"
                    label="Back"
                    className="form-button-secondary"
                    onClick={() => {
                      if (dirty && !window.confirm("You have unsaved changes. Leave anyway?")) return;
                      navigate(patient?.id ? `/clinic/patients/${patient.id}` : "/clinic/patients");
                    }}
                  />
                </div>
              </div>

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Doctor & Fee</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="form-input-label">Doctor *</label>
                    <Dropdown
                      value={values.doctorId}
                      options={doctorOptions}
                      filter
                      placeholder="Select doctor"
                      className="form-input"
                      onChange={(e) => {
                        setFieldValue("doctorId", e.value);
                        const doc = doctors.find((d) => d.id === e.value);
                        if (doc && isNew) {
                          setFieldValue("consultationFee", Number(doc.defaultConsultationFee || 0));
                        }
                      }}
                    />
                    <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm" />
                  </div>
                  <Field name="visitDate">
                    {({ field }: any) => (
                      <div>
                        <label className="form-input-label">Visit Date</label>
                        <InputText {...field} type="datetime-local" className="form-input w-full" />
                      </div>
                    )}
                  </Field>
                  <Field name="consultationFee">
                    {({ field }: any) => (
                      <div>
                        <label className="form-input-label">Consultation Fee *</label>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Rs.</span>
                          <InputText
                            {...field}
                            type="number"
                            min={0}
                            step="0.01"
                            className="form-input w-full"
                            onChange={(e) => setFieldValue("consultationFee", Number(e.target.value))}
                          />
                        </div>
                        <div className="text-sm text-slate-500 mt-1">{formatCurrency(values.consultationFee)}</div>
                        <ErrorMessage name="consultationFee" component="div" className="text-red-500 text-sm" />
                      </div>
                    )}
                  </Field>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Vitals</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    ["vitals.temperature", "Temperature (°C)"],
                    ["vitals.systolicBP", "Systolic BP"],
                    ["vitals.diastolicBP", "Diastolic BP"],
                    ["vitals.pulse", "Pulse"],
                    ["vitals.respiratoryRate", "Respiratory Rate"],
                    ["vitals.oxygenSaturation", "SpO2 (%)"],
                    ["vitals.height", "Height (cm)"],
                    ["vitals.weight", "Weight (kg)"],
                    ["vitals.bmi", "BMI"],
                  ].map(([name, label]) => (
                    <Field key={name} name={name}>
                      {({ field }: any) => (
                        <div>
                          <label className="form-input-label">{label}</label>
                          <InputText
                            {...field}
                            type="number"
                            className="form-input w-full"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value === "" ? null : Number(e.target.value);
                              setFieldValue(name, val);
                              if (name === "vitals.height" || name === "vitals.weight") {
                                const height = name === "vitals.height" ? val : values.vitals?.height;
                                const weight = name === "vitals.weight" ? val : values.vitals?.weight;
                                setFieldValue("vitals.bmi", calculateBmi(height, weight));
                              }
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  ))}
                </div>
              </section>

              {[
                ["chiefComplaint", "Chief Complaint"],
                ["history", "History / History of Present Illness"],
                ["examination", "Examination"],
                ["observations", "Doctor Observations"],
                ["diagnosisNotes", "Diagnosis Notes"],
                ["advice", "Advice / Instructions"],
              ].map(([name, label]) => (
                <section className="mb-4" key={name}>
                  <label className="form-input-label">{label}</label>
                  <Field name={name}>
                    {({ field }: any) => <InputTextarea {...field} rows={3} className="form-input w-full" />}
                  </Field>
                </section>
              ))}

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Diagnoses</h2>
                <FieldArray name="diagnoses">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {(values.diagnoses || []).map((_, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                          <Field name={`diagnoses.${index}.diagnosisName`}>
                            {({ field }: any) => (
                              <div className="md:col-span-2">
                                <label className="form-input-label">Diagnosis</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <div className="flex items-center gap-2 pb-2">
                            <InputSwitch
                              checked={!!values.diagnoses?.[index]?.isPrimary}
                              onChange={(e) => setFieldValue(`diagnoses.${index}.isPrimary`, e.value)}
                            />
                            <span className="text-sm">Primary</span>
                          </div>
                          <button
                            type="button"
                            className="pi pi-trash icon-action icon-action-danger"
                            title="Remove"
                            onClick={() => remove(index)}
                          />
                        </div>
                      ))}
                      <Button type="button" label="Add Diagnosis" className="form-button-secondary" onClick={() => push({ diagnosisName: "", isPrimary: false })} />
                    </div>
                  )}
                </FieldArray>
              </section>

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Recommended Tests</h2>
                <FieldArray name="tests">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {(values.tests || []).length === 0 && (
                        <div className="text-sm text-slate-500">No tests have been recommended.</div>
                      )}
                      {(values.tests || []).map((_, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                          <Field name={`tests.${index}.testName`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Test</label>
                                <InputText {...field} className="form-input w-full" list="clinic-test-suggestions" />
                              </div>
                            )}
                          </Field>
                          <Field name={`tests.${index}.notes`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Notes</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <button
                            type="button"
                            className="pi pi-trash icon-action icon-action-danger"
                            title="Remove"
                            onClick={() => remove(index)}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        label="Add Test"
                        className="form-button-secondary"
                        onClick={async () => {
                          try {
                            await searchTests();
                          } catch {
                            /* optional master warm-up */
                          }
                          push({ testName: "", notes: "" });
                        }}
                      />
                    </div>
                  )}
                </FieldArray>
              </section>

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Prescription</h2>
                <FieldArray name="prescription.items">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {(values.prescription?.items || []).length === 0 && (
                        <div className="text-sm text-slate-500">No prescriptions found.</div>
                      )}
                      {(values.prescription?.items || []).map((_, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 border p-3 rounded">
                          <Field name={`prescription.items.${index}.medicationName`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Medication</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <Field name={`prescription.items.${index}.strength`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Strength</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <Field name={`prescription.items.${index}.dosage`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Dosage</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <Field name={`prescription.items.${index}.frequency`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Frequency</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <Field name={`prescription.items.${index}.duration`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Duration</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <Field name={`prescription.items.${index}.instructions`}>
                            {({ field }: any) => (
                              <div>
                                <label className="form-input-label">Instructions</label>
                                <InputText {...field} className="form-input w-full" />
                              </div>
                            )}
                          </Field>
                          <div className="md:col-span-3">
                            <button type="button" className="pi pi-trash icon-action icon-action-danger" title="Remove" onClick={() => remove(index)} />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        label="Add Medication"
                        className="form-button-secondary"
                        onClick={async () => {
                          try {
                            await searchMedications();
                          } catch {
                            /* optional */
                          }
                          push({
                            medicationName: "",
                            strength: "",
                            dosage: "",
                            frequency: "",
                            duration: "",
                            instructions: "",
                            sortOrder: (values.prescription?.items?.length || 0) + 1,
                          });
                        }}
                      />
                    </div>
                  )}
                </FieldArray>
              </section>

              <section className="mb-5">
                <h2 className="text-lg font-semibold mb-2">Follow-up</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <InputSwitch
                      checked={values.followUpRequired}
                      onChange={(e) => setFieldValue("followUpRequired", e.value)}
                    />
                    <span>Follow-up required</span>
                  </div>
                  {values.followUpRequired && (
                    <Field name="followUpDate">
                      {({ field }: any) => (
                        <div>
                          <label className="form-input-label">Follow-up Date</label>
                          <InputText {...field} type="date" className="form-input w-full" />
                        </div>
                      )}
                    </Field>
                  )}
                  <Field name="followUpNotes">
                    {({ field }: any) => (
                      <div className="md:col-span-3">
                        <label className="form-input-label">Follow-up Instructions</label>
                        <InputTextarea {...field} rows={2} className="form-input w-full" />
                      </div>
                    )}
                  </Field>
                </div>
              </section>

              <div className="flex gap-2 no-print">
                <Button type="submit" label={isSubmitting ? "Saving..." : "Save Consultation"} className="form-button-primary" disabled={isSubmitting} />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

function DirtyWatcher({ dirty, onDirtyChange }: { dirty: boolean; onDirtyChange: (v: boolean) => void }) {
  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);
  return null;
}

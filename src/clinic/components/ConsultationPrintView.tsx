import type { ConsultationDetails, Patient } from "../models/clinic.models";
import { bloodGroupLabel, formatCurrency, genderLabel } from "../utils/clinic.utils";
import MedicalDocumentHeader from "./MedicalDocumentHeader";

type Props = {
  consultation: ConsultationDetails;
  patient: Patient | null;
};

export default function ConsultationPrintView({ consultation, patient }: Props) {
  const vitals = consultation.vitals;

  return (
    <div className="print-document bg-white text-black p-8 max-w-[210mm] mx-auto">
      <MedicalDocumentHeader practice={consultation.practice} doctor={consultation.doctor} />

      <div className="border-t border-b border-black py-3 my-4 text-sm grid grid-cols-2 gap-2">
        <div><strong>Patient:</strong> {consultation.patientName || patient?.fullName}</div>
        <div><strong>MR Number:</strong> {consultation.patientMRNumber || patient?.mrNumber}</div>
        <div><strong>Age / Gender:</strong> {patient?.age ?? "—"} / {genderLabel(patient?.gender)}</div>
        <div><strong>Contact:</strong> {patient?.contactNumber || "—"}</div>
        <div><strong>Blood Group:</strong> {bloodGroupLabel(patient?.bloodGroup)}</div>
        <div><strong>Visit Date:</strong> {new Date(consultation.visitDate).toLocaleString()}</div>
        <div><strong>Visit No:</strong> {consultation.visitNumber}</div>
        <div><strong>Consultation Fee:</strong> {formatCurrency(consultation.consultationFee)}</div>
      </div>

      {patient?.allergies && (
        <div className="mb-4 border border-black p-2">
          <strong>Allergies:</strong> {patient.allergies}
        </div>
      )}

      {vitals && (
        <section className="mb-4 text-sm">
          <h3 className="font-bold uppercase mb-1">Vitals</h3>
          <div>
            Temp: {vitals.temperature ?? "—"} · BP: {vitals.systolicBP ?? "—"}/{vitals.diastolicBP ?? "—"} ·
            Pulse: {vitals.pulse ?? "—"} · RR: {vitals.respiratoryRate ?? "—"} · SpO2: {vitals.oxygenSaturation ?? "—"} ·
            Ht: {vitals.height ?? "—"} · Wt: {vitals.weight ?? "—"} · BMI: {vitals.bmi ?? "—"}
          </div>
        </section>
      )}

      {[
        ["Chief Complaint", consultation.chiefComplaint],
        ["History", consultation.history],
        ["Examination", consultation.examination],
        ["Observations", consultation.observations],
        ["Diagnosis Notes", consultation.diagnosisNotes],
        ["Advice", consultation.advice],
      ].map(([title, value]) =>
        value ? (
          <section key={title as string} className="mb-3 text-sm">
            <h3 className="font-bold uppercase mb-1">{title}</h3>
            <div className="whitespace-pre-wrap">{value}</div>
          </section>
        ) : null
      )}

      {(consultation.diagnoses?.length ?? 0) > 0 && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Diagnoses</h3>
          <ul className="list-disc pl-5">
            {consultation.diagnoses.map((d, i) => (
              <li key={i}>
                {d.diagnosisName}
                {d.isPrimary ? " (Primary)" : ""}
                {d.notes ? ` — ${d.notes}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(consultation.tests?.length ?? 0) > 0 && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Recommended Tests</h3>
          <ul className="list-disc pl-5">
            {consultation.tests.map((t, i) => (
              <li key={i}>
                {t.testName}
                {t.notes ? ` — ${t.notes}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(consultation.prescription?.items?.length ?? 0) > 0 && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Prescription</h3>
          <ol className="list-decimal pl-5">
            {consultation.prescription!.items.map((item, i) => (
              <li key={i} className="mb-1">
                <strong>{item.medicationName}</strong>
                {item.strength ? ` ${item.strength}` : ""}
                {item.dosage ? ` — ${item.dosage}` : ""}
                {item.frequency ? `, ${item.frequency}` : ""}
                {item.duration ? `, ${item.duration}` : ""}
                {item.instructions ? ` (${item.instructions})` : ""}
              </li>
            ))}
          </ol>
        </section>
      )}

      {consultation.followUpRequired && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Follow-up</h3>
          <div>
            {consultation.followUpDate ? new Date(consultation.followUpDate).toLocaleDateString() : "Required"}
            {consultation.followUpNotes ? ` — ${consultation.followUpNotes}` : ""}
          </div>
        </section>
      )}

      <div className="mt-10 text-sm flex justify-between">
        <div>
          <div className="font-semibold">{consultation.doctor?.fullName || consultation.doctorName}</div>
          <div>{consultation.doctor?.registrationNumber}</div>
        </div>
        <div className="text-right">Signature</div>
      </div>
    </div>
  );
}

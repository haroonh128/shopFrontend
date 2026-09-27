import type { ConsultationDetails, Patient } from "../models/clinic.models";
import { formatCurrency } from "../utils/clinic.utils";
import MedicalDocumentHeader from "./MedicalDocumentHeader";

type Props = {
  consultation: ConsultationDetails;
  patient: Patient | null;
};

export default function PrescriptionPrintView({ consultation, patient }: Props) {
  return (
    <div className="print-document bg-white text-black p-8 max-w-[210mm] mx-auto">
      <MedicalDocumentHeader practice={consultation.practice} doctor={consultation.doctor} />

      <div className="border-t border-b border-black py-3 my-4 text-sm grid grid-cols-2 gap-2">
        <div><strong>Patient:</strong> {consultation.patientName || patient?.fullName}</div>
        <div><strong>MR Number:</strong> {consultation.patientMRNumber || patient?.mrNumber}</div>
        <div><strong>Age / Gender:</strong> {patient?.age ?? "—"} / {patient?.gender || "—"}</div>
        <div><strong>Date:</strong> {new Date(consultation.visitDate).toLocaleDateString()}</div>
        <div className="col-span-2"><strong>Consultation Fee:</strong> {formatCurrency(consultation.consultationFee)}</div>
      </div>

      {(consultation.diagnoses?.length ?? 0) > 0 && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Diagnosis</h3>
          <div>{consultation.diagnoses.map((d) => d.diagnosisName).join(", ")}</div>
        </section>
      )}

      <section className="mb-4 text-sm">
        <h3 className="font-bold uppercase mb-2">Rx</h3>
        {(consultation.prescription?.items?.length ?? 0) === 0 ? (
          <div>No medications prescribed.</div>
        ) : (
          <ol className="list-decimal pl-5">
            {consultation.prescription!.items.map((item, i) => (
              <li key={i} className="mb-2">
                <div className="font-semibold">
                  {item.medicationName}
                  {item.strength ? ` ${item.strength}` : ""}
                </div>
                <div>
                  {[item.dosage, item.frequency, item.duration, item.route, item.instructions]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {consultation.advice && (
        <section className="mb-3 text-sm">
          <h3 className="font-bold uppercase mb-1">Advice</h3>
          <div className="whitespace-pre-wrap">{consultation.advice}</div>
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

      <div className="mt-12 text-sm">
        <div className="font-semibold">{consultation.doctor?.fullName || consultation.doctorName}</div>
        <div>{consultation.doctor?.qualifications}</div>
        <div>{consultation.doctor?.registrationNumber}</div>
      </div>
    </div>
  );
}

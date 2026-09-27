import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import PatientForm from "../components/PatientForm";
import type { ConsultationListItem, Patient } from "../models/clinic.models";
import {
  getPatientById,
  getPatientConsultations,
  updatePatient,
} from "../services/clinic.service";
import { bloodGroupLabel, formatCurrency } from "../utils/clinic.utils";

type Tab = "overview" | "consultations";

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<ConsultationListItem[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getPatientById(id), getPatientConsultations(id)]);
      setPatient(p);
      setConsultations(Array.isArray(c) ? c : []);
    } catch {
      setPatient(null);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading patient...</div>;
  }

  if (!patient) {
    return (
      <div className="p-6">
        <p className="text-slate-500 mb-3">Patient not found.</p>
        <button
          type="button"
          className="pi pi-arrow-left icon-action"
          title="Back"
          onClick={() => navigate("/clinic/patients")}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <PatientForm
        initialValues={patient}
        onSubmit={async (values) => {
          await updatePatient(patient.id!, values);
          setEditing(false);
          await load();
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-6 border-2 border-gray-300 rounded-md">
        <div className="flex flex-col md:flex-row md:justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500 font-semibold">{patient.mrNumber}</div>
            <h1 className="text-3xl font-bold">{patient.fullName}</h1>
            <div className="mt-2 text-sm text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
              <span>Age: {patient.age ?? "—"}</span>
              <span>Gender: {patient.gender}</span>
              <span>Contact: {patient.contactNumber || "—"}</span>
              <span>Blood Group: {bloodGroupLabel(patient.bloodGroup)}</span>
            </div>
            {patient.allergies && (
              <div className="mt-3 border border-amber-700 bg-amber-50 px-3 py-2 rounded">
                <span className="font-semibold uppercase text-amber-900">Allergies: </span>
                <span className="font-bold text-amber-950">{patient.allergies}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 no-print">
            <Button label="Edit" className="form-button-secondary" onClick={() => setEditing(true)} />
            <Button
              label="New Consultation"
              className="form-button-primary"
              onClick={() => navigate(`/clinic/patients/${patient.id}/consultations/new`)}
            />
            <button
              type="button"
              className="pi pi-arrow-left icon-action"
              title="Back"
              onClick={() => navigate("/clinic/patients")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 no-print">
        <Button
          label="Overview"
          className={tab === "overview" ? "form-button-primary" : "form-button-secondary"}
          onClick={() => setTab("overview")}
        />
        <Button
          label="Consultations"
          className={tab === "consultations" ? "form-button-primary" : "form-button-secondary"}
          onClick={() => setTab("consultations")}
        />
      </div>

      {tab === "overview" && (
        <div className="card p-6 border-2 border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-semibold">Email:</span> {patient.email || "—"}</div>
          <div><span className="font-semibold">Address:</span> {patient.address || "—"}</div>
          <div><span className="font-semibold">Height:</span> {patient.height ?? "—"} cm</div>
          <div><span className="font-semibold">Weight:</span> {patient.weight ?? "—"} kg</div>
          <div><span className="font-semibold">BMI:</span> {patient.bmi ?? "—"}</div>
          <div><span className="font-semibold">Emergency:</span> {patient.emergencyContactName || "—"} {patient.emergencyContactNumber ? `(${patient.emergencyContactNumber})` : ""}</div>
          <div className="md:col-span-2"><span className="font-semibold">Notes:</span> {patient.notes || "—"}</div>
        </div>
      )}

      {tab === "consultations" && (
        <div className="card p-6 border-2 border-gray-300 rounded-md overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2">Date</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Chief Complaint</th>
                <th className="p-2">Diagnosis</th>
                <th className="p-2">Fee</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">No previous consultations found.</td>
                </tr>
              )}
              {consultations.map((c) => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="p-2">{new Date(c.visitDate).toLocaleDateString()}</td>
                  <td className="p-2">{c.doctorName}</td>
                  <td className="p-2">{c.chiefComplaint || "—"}</td>
                  <td className="p-2">{c.diagnosisSummary || "—"}</td>
                  <td className="p-2">{formatCurrency(c.consultationFee)}</td>
                  <td className="p-2">
                    <Button
                      label="View"
                      className="form-button-secondary p-button-sm"
                      onClick={() => navigate(`/clinic/consultations/${c.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

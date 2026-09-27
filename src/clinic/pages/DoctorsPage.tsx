import { useCallback, useEffect, useState } from "react";
import DoctorForm from "../components/DoctorForm";
import type { Doctor } from "../models/clinic.models";
import { createDoctor, deleteDoctor, getDoctors, updateDoctor } from "../services/clinic.service";
import { formatCurrency } from "../utils/clinic.utils";

export default function DoctorsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<Doctor>>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openForm = (doctor?: Doctor) => {
    setInitialValues(doctor ?? {});
    setView("form");
  };

  const handleSubmit = async (values: Doctor) => {
    const { id, practiceId, ...rest } = values;
    if (id) {
      await updateDoctor(id, { ...rest, id, active: values.active ?? true });
    } else {
      await createDoctor({ ...rest, active: true });
    }
    await load();
    setView("list");
  };

  const handleDelete = async (doctor: Doctor) => {
    if (!doctor.id) return;
    if (!window.confirm(`Delete doctor "${doctor.fullName}"?`)) return;
    await deleteDoctor(doctor.id);
    await load();
  };

  if (view === "form") {
    return (
      <DoctorForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <button type="button" className="pi pi-plus icon-action" title="Add doctor" onClick={() => openForm()} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Name</th>
              <th className="p-2">Specialization</th>
              <th className="p-2">Registration</th>
              <th className="p-2">Default Fee</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">Loading doctors...</td>
              </tr>
            )}
            {!loading && doctors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">No doctors found. Add a doctor to begin consultations.</td>
              </tr>
            )}
            {doctors.map((d) => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="p-2">{d.fullName}</td>
                <td className="p-2">{d.specialization || "—"}</td>
                <td className="p-2">{d.registrationNumber || "—"}</td>
                <td className="p-2">{formatCurrency(d.defaultConsultationFee)}</td>
                <td className="p-2">
                  <button type="button" className="pi pi-pencil icon-action mr-3" onClick={() => openForm(d)} title="Edit" />
                  <button type="button" className="pi pi-trash icon-action icon-action-danger" onClick={() => handleDelete(d)} title="Delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

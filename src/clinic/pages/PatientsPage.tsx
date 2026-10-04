import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import PatientForm from "../components/PatientForm";
import type { Patient, PatientSearchParams } from "../models/clinic.models";
import { createPatient, searchPatients, updatePatient } from "../services/clinic.service";
import { genderOptions } from "../utils/clinic.utils";

const emptyFilters: PatientSearchParams = {
  mrNumber: "",
  name: "",
  contactNumber: "",
  gender: "",
  page: 1,
  pageSize: 20,
  sortBy: "fullName",
  sortDesc: false,
};

export default function PatientsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "form">("list");
  const [filters, setFilters] = useState<PatientSearchParams>(emptyFilters);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formInitial, setFormInitial] = useState<Partial<Patient>>({});

  const load = useCallback(async (params: PatientSearchParams = filters) => {
    setLoading(true);
    try {
      const result = await searchPatients(params);
      setPatients(result?.items ?? []);
      setTotalCount(result?.totalCount ?? 0);
    } catch {
      setPatients([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void load(emptyFilters);
  }, []);

  const handleSearch = () => {
    const next = { ...filters, page: 1 };
    setFilters(next);
    void load(next);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    void load(emptyFilters);
  };

  const openRegister = () => {
    setFormInitial({});
    setView("form");
  };

  const handleSubmit = async (values: Patient) => {
    const payload: Patient = {
      ...values,
      dateOfBirth: values.dateOfBirth || null,
      height: values.height || null,
      weight: values.weight || null,
      bmi: values.bmi || null,
    };
    if (values.id) {
      await updatePatient(values.id, payload);
    } else {
      await createPatient(payload);
    }
    setView("list");
    await load(filters);
  };

  if (view === "form") {
    return (
      <PatientForm
        initialValues={formInitial}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / (filters.pageSize || 20)));

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <button type="button" className="pi pi-plus icon-action" title="Add patient" onClick={openRegister} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <InputText
          placeholder="MR Number"
          value={filters.mrNumber || ""}
          onChange={(e) => setFilters((f) => ({ ...f, mrNumber: e.target.value }))}
          className="form-input"
        />
        <InputText
          placeholder="Patient Name"
          value={filters.name || ""}
          onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
          className="form-input"
        />
        <InputText
          placeholder="Contact Number"
          value={filters.contactNumber || ""}
          onChange={(e) => setFilters((f) => ({ ...f, contactNumber: e.target.value }))}
          className="form-input"
        />
        <Dropdown
          value={filters.gender || null}
          options={genderOptions}
          showClear
          placeholder="Gender"
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.value || "" }))}
          className="form-input"
        />
        <div className="flex gap-2 ms-auto">
          <Button label="Search" className="form-button-primary" onClick={handleSearch} />
          <Button label="Clear" className="form-button-secondary" onClick={clearFilters} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">MR Number</th>
              <th className="p-2">Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Last Visit</th>
              <th className="p-2">Last Doctor</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-slate-500">Searching patients...</td>
              </tr>
            )}
            {!loading && patients.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-slate-500">No patient found matching your search.</td>
              </tr>
            )}
            {patients.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="p-2 font-semibold">{p.mrNumber}</td>
                <td className="p-2">{p.fullName}</td>
                <td className="p-2">{p.age ?? "—"}</td>
                <td className="p-2">{p.gender}</td>
                <td className="p-2">{p.contactNumber || "—"}</td>
                <td className="p-2">{p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString() : "—"}</td>
                <td className="p-2">{p.lastDoctorName || "—"}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="pi pi-eye icon-action"
                    title="View"
                    onClick={() => navigate(`/clinic/patients/${p.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-slate-600">{totalCount} patient(s)</div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="pi pi-chevron-left icon-action"
            title="Previous page"
            disabled={(filters.page || 1) <= 1}
            onClick={() => {
              const next = { ...filters, page: (filters.page || 1) - 1 };
              setFilters(next);
              void load(next);
            }}
          />
          <span className="text-sm">
            Page {filters.page || 1} / {totalPages}
          </span>
          <button
            type="button"
            className="pi pi-chevron-right icon-action"
            title="Next page"
            disabled={(filters.page || 1) >= totalPages}
            onClick={() => {
              const next = { ...filters, page: (filters.page || 1) + 1 };
              setFilters(next);
              void load(next);
            }}
          />
        </div>
      </div>
    </div>
  );
}

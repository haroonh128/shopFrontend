import { http } from "../../core/http";
import type {
  ConsultationDetails,
  ConsultationListItem,
  Doctor,
  MasterItem,
  PagedResult,
  Patient,
  PatientSearchParams,
  Practice,
} from "../models/clinic.models";

export const getCurrentPractice = () => http.get<Practice>("/Practice/current");
export const updateCurrentPractice = (data: Partial<Practice>) =>
  http.put<Practice, Partial<Practice>>("/Practice/current", data);

export const getDoctors = () => http.get<Doctor[]>("/Doctor");
export const getDoctorById = (id: string) => http.get<Doctor>(`/Doctor/${id}`);
export const createDoctor = (data: Doctor) => http.post<Doctor, Doctor>("/Doctor", data);
export const updateDoctor = (id: string, data: Doctor) =>
  http.put<Doctor, Doctor>(`/Doctor/${id}`, data);
export const deleteDoctor = (id: string) => http.delete<boolean>(`/Doctor/${id}`);

export const searchPatients = (params: PatientSearchParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return http.get<PagedResult<Patient>>(`/Patient/search${qs ? `?${qs}` : ""}`);
};

export const getPatientById = (id: string) => http.get<Patient>(`/Patient/${id}`);
export const createPatient = (data: Patient) => http.post<Patient, Patient>("/Patient", data);
export const updatePatient = (id: string, data: Patient) =>
  http.put<Patient, Patient>(`/Patient/${id}`, data);
export const deletePatient = (id: string) => http.delete<boolean>(`/Patient/${id}`);

export const getPatientConsultations = (patientId: string) =>
  http.get<ConsultationListItem[]>(`/Patient/${patientId}/consultations`);

export const getConsultationById = (id: string) =>
  http.get<ConsultationDetails>(`/Consultation/${id}`);
export const createConsultation = (data: ConsultationDetails) =>
  http.post<ConsultationDetails, ConsultationDetails>("/Consultation", data);
export const updateConsultation = (id: string, data: ConsultationDetails) =>
  http.put<ConsultationDetails, ConsultationDetails>(`/Consultation/${id}`, data);

export const searchDiagnoses = (q?: string) =>
  http.get<MasterItem[]>(`/ClinicMaster/diagnoses${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const createDiagnosis = (data: { name: string; code?: string }) =>
  http.post<MasterItem, typeof data>("/ClinicMaster/diagnoses", data);

export const searchTests = (q?: string) =>
  http.get<MasterItem[]>(`/ClinicMaster/tests${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const createTest = (data: { name: string; category?: string }) =>
  http.post<MasterItem, typeof data>("/ClinicMaster/tests", data);

export const searchMedications = (q?: string) =>
  http.get<MasterItem[]>(`/ClinicMaster/medications${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const createMedication = (data: {
  name: string;
  genericName?: string;
  strength?: string;
  form?: string;
}) => http.post<MasterItem, typeof data>("/ClinicMaster/medications", data);

export interface Practice {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string | null;
  active: boolean;
}

export interface Doctor {
  id?: string;
  practiceId?: string;
  userId?: string | null;
  fullName: string;
  qualifications: string;
  specialization: string;
  registrationNumber: string;
  phone: string;
  email: string;
  address: string;
  defaultConsultationFee: number;
  active: boolean;
  isDeleted?: boolean;
}

export interface Patient {
  id?: string;
  practiceId?: string;
  mrNumber?: string;
  fullName: string;
  dateOfBirth?: string | null;
  age?: number | null;
  gender: string;
  maritalStatus?: string | null;
  contactNumber: string;
  alternateContactNumber?: string | null;
  email?: string | null;
  address?: string | null;
  bloodGroup?: string | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  allergies?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  notes?: string | null;
  lastVisitDate?: string | null;
  lastDoctorName?: string | null;
  active?: boolean;
  createdAt?: string;
}

export interface PatientSearchParams {
  mrNumber?: string;
  name?: string;
  contactNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  registrationFrom?: string;
  registrationTo?: string;
  sortBy?: string;
  sortDesc?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ConsultationVitals {
  temperature?: number | null;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  pulse?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
}

export interface ConsultationDiagnosis {
  id?: string;
  diagnosisId?: string | null;
  diagnosisName: string;
  isPrimary: boolean;
  notes?: string | null;
}

export interface ConsultationTestItem {
  id?: string;
  testId?: string | null;
  testName: string;
  notes?: string | null;
}

export interface PrescriptionItem {
  id?: string;
  medicationId?: string | null;
  medicationName: string;
  strength?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  route?: string | null;
  duration?: string | null;
  quantity?: string | null;
  instructions?: string | null;
  sortOrder?: number;
}

export interface Prescription {
  id?: string;
  prescriptionDate?: string;
  notes?: string | null;
  items: PrescriptionItem[];
}

export interface ConsultationListItem {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  visitNumber: string;
  chiefComplaint?: string | null;
  diagnosisSummary?: string | null;
  consultationFee: number;
}

export interface ConsultationDetails {
  id?: string;
  practiceId?: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  patientName?: string;
  patientMRNumber?: string;
  visitDate: string;
  visitNumber?: string;
  chiefComplaint?: string | null;
  history?: string | null;
  examination?: string | null;
  observations?: string | null;
  diagnosisNotes?: string | null;
  advice?: string | null;
  followUpRequired: boolean;
  followUpDate?: string | null;
  followUpNotes?: string | null;
  consultationFee: number;
  vitals?: ConsultationVitals | null;
  diagnoses: ConsultationDiagnosis[];
  tests: ConsultationTestItem[];
  prescription?: Prescription | null;
  doctor?: Doctor | null;
  practice?: Practice | null;
}

export interface MasterItem {
  id: string;
  name: string;
  code?: string | null;
  category?: string | null;
  genericName?: string | null;
  strength?: string | null;
  form?: string | null;
  active: boolean;
}

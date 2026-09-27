import { Routes, Route } from "react-router-dom";
import RequireAuth from "../auth/guards/RequireAuth";
import RequireAdmin from "../auth/guards/RequireAdmin";
import MainLayout from "../core/layouts/MainLayout";
import Dashboard from "../authentication/pages/dashboard";
import Modules from "../authentication/pages/modules";
import TailorDashboard from "../tailor/pages/tailor-dashboard";
import Measurements from "../tailor/pages/measurements";
import Costs from "../tailor/pages/costs";
import PatientsPage from "../clinic/pages/PatientsPage";
import PatientProfilePage from "../clinic/pages/PatientProfilePage";
import ConsultationFormPage from "../clinic/pages/ConsultationFormPage";
import DoctorsPage from "../clinic/pages/DoctorsPage";
import PracticePage from "../clinic/pages/PracticePage";
import AdminUsersPage from "../admin/pages/AdminUsersPage";

export default function ProtectedRoutes() {
  return (
    <Routes>
      <Route
        path="/modules"
        element={
          <RequireAuth>
            <Modules />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/tailor-dashboard"
        element={
          <RequireAuth>
            <MainLayout>
              <TailorDashboard />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/measurements"
        element={
          <RequireAuth>
            <MainLayout>
              <Measurements />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/costs"
        element={
          <RequireAuth>
            <MainLayout>
              <Costs />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/patients"
        element={
          <RequireAuth>
            <MainLayout>
              <PatientsPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/patients/:id"
        element={
          <RequireAuth>
            <MainLayout>
              <PatientProfilePage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/patients/:patientId/consultations/new"
        element={
          <RequireAuth>
            <MainLayout>
              <ConsultationFormPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/consultations/:id"
        element={
          <RequireAuth>
            <MainLayout>
              <ConsultationFormPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/doctors"
        element={
          <RequireAuth>
            <MainLayout>
              <DoctorsPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/clinic/practice"
        element={
          <RequireAuth>
            <MainLayout>
              <PracticePage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <MainLayout>
              <AdminUsersPage />
            </MainLayout>
          </RequireAdmin>
        }
      />
    </Routes>
  );
}

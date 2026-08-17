import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import RequireAuth from "../auth/guards/RequireAuth";
import MainLayout from "../core/layouts/MainLayout";
import Dashboard from "../authentication/pages/dashboard";
import Modules from "../authentication/pages/modules";
import TailorDashboard from "../tailor/pages/tailor-dashboard";
import Measurements from "../tailor/pages/measurements";
import Costs from "../tailor/pages/costs";

export default function ProtectedRoutes(){
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
        </Routes>
    );
}
import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import RequireAuth from "../auth/guards/RequireAuth";
import MainLayout from "../core/layouts/MainLayout";
import Dashboard from "../authentication/pages/dashboard";
import Modules from "../authentication/pages/modules";

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
        </Routes>
    );
}
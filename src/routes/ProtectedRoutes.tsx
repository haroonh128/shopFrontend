import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import RequireAuth from "../auth/guards/RequireAuth";
import MainLayout from "../core/layouts/MainLayout";

export default function ProtectedRoutes(){
    return (
        <Routes>
            <Route
            path="/"
            element={
                <RequireAuth>
                    <MainLayout>
                        <div>Home</div>
                    </MainLayout>
                </RequireAuth>
            }
            />
        </Routes>
    );
}
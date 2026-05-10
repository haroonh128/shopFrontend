import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import Login from "../authentication/pages/Login";
import Register from "../authentication/pages/Register";
import Otp from "../authentication/pages/Otp";
import ForgotPassword from "../authentication/pages/ForgotPassword";

export default function PublicRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<Otp />} />
        </Routes>
    );
}
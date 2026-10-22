import { useAuth } from "../../auth/hooks";
import LoginForm from "../components/LoginForm";
import { login as loginApi } from "../../auth/api";
import { Link, useNavigate } from "react-router-dom";
import { getPostAuthPath } from "../config/modules";
import { setSelectedModuleId } from "../utils/selectedModule";

export default function Login(){

    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async(data:{phoneNumber:string, pin:string}) => {
        try {
            const res = await loginApi({ phoneNumber: data.phoneNumber, pin: data.pin });

            if (res.requiresTwoFactor || !res.accessToken) {

                localStorage.setItem("phoneNumber", data.phoneNumber);
                navigate("/otp");
                return;
            }

            login(res.accessToken);
            const moduleId = res.user?.moduleId;
            if (moduleId) setSelectedModuleId(moduleId);
            navigate(getPostAuthPath(res.user));
        } catch (error) {
            // Request errors are already handled by the shared HTTP client.
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
            <div className="login-image hidden md:block" />

            <div className="flex items-center justify-center p-6 bg-blue-700/50">
                <div className="block bg-white rounded-lg p-4 w-full max-w-md pb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d7a68]">Welcome back</p>
                    <h5 className="text-2xl font-semibold mt-1 mb-1 text-[#16302c]">Sign in</h5>
                    <p className="text-sm text-[#5c726c] mb-5">Pick up where you left off.</p>
                    <LoginForm onSubmit={handleSubmit} />

                <div className="flex justify-between mt-2">
                    {/* <Link to="/register" className="text-sm text-blue-500 hover:text-blue-600">Don't have an account? Register</Link> */}
                    <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">Forgot password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
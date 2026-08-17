import { useAuth } from "../../auth/hooks";
import LoginForm from "../components/LoginForm";
import { login as loginApi } from "../../auth/api";
import { useNavigate } from "react-router-dom";

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
            navigate("/modules");
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
                    <h5 className="text-2xl font-bold mb-4 text-neutral-900">Login</h5>
                    <LoginForm onSubmit={handleSubmit} />

                <div className="flex justify-between mt-2">
                    <a href="/register" className="text-sm text-blue-500 hover:text-blue-600">Don't have an account? Register</a>
                    <a href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">Forgot password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
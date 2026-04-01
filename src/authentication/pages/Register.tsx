
import { register } from "../../auth/api/auth.api";
import RegistrationForm from "../components/RegistrationForm";
import { registrationFormValues } from "../models/registration.model";
export default function Register(){

    const handleSubmit = async(data:registrationFormValues) => {
         await register(data).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
            <div className="login-image hidden md:block" />

            <div className="flex items-center justify-center p-6 bg-blue-700/50">
                <div className="block bg-white rounded-lg p-4 w-full max-w-md pb-10">
                    <h5 className="text-2xl font-bold mb-4 text-neutral-900">Register</h5>
                    <RegistrationForm onSubmit={handleSubmit} />
                    <a href="/login" className="text-sm text-blue-500 hover:text-blue-600 mt-4 block text-center">Already have an account? Login</a>
                </div>
            </div>
        </div>
    );
}
import { register } from "../../auth/api/auth.api";
import RegistrationForm from "../components/RegistrationForm";
import { registrationFormValues } from "../models/registration.model";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (data: registrationFormValues) => {
    try {
      await register(data);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="login-image hidden md:block" />

      <div className="flex items-center justify-center p-6 bg-blue-700/50">
        <div className="block bg-white rounded-lg p-4 w-full max-w-md pb-10">
          <h5 className="text-2xl font-bold mb-4 text-neutral-900">Register</h5>
          <RegistrationForm onSubmit={handleSubmit} />
          <Link
            to="/login"
            className="text-sm text-blue-500 hover:text-blue-600 mt-4 block text-center"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

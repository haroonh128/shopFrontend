import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../auth/api/auth.api";
import ForgotPasswordForm, {
  ForgotPasswordFormValues,
} from "../components/ForgotPasswordForm";
import ResetPasswordForm, {
  ResetPasswordFormValues,
} from "../components/ResetPasswordForm";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");

  const handleEmailSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword({ email: values.email.trim() });
      setEmail(values.email.trim());
      setStep("reset");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        email,
        otpCode: values.otpCode,
        newPin: values.newPin,
        confirmNewPin: values.confirmNewPin,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="login-image hidden md:block" />

      <div className="flex items-center justify-center p-6 bg-blue-700/50">
        <div className="block bg-white rounded-lg p-4 w-full max-w-md pb-10">
          {step === "email" ? (
            <>
              <h5 className="text-2xl font-bold mb-2 text-neutral-900">
                Forgot password
              </h5>
              <p className="text-sm text-neutral-600 mb-4">
                Enter the email on your account. We&apos;ll send a reset code to
                that email address.
              </p>
              <ForgotPasswordForm onSubmit={handleEmailSubmit} />
            </>
          ) : (
            <>
              <h5 className="text-2xl font-bold mb-2 text-neutral-900">
                Reset PIN
              </h5>
              <p className="text-sm text-neutral-600 mb-4">
                Enter the code sent for <span className="font-medium">{email}</span>{" "}
                and choose a new 4-digit PIN.
              </p>
              <ResetPasswordForm onSubmit={handleResetSubmit} />
              <button
                type="button"
                onClick={() => setStep("email")}
                className="mt-3 text-sm text-blue-500 hover:text-blue-600"
              >
                Use a different email
              </button>
            </>
          )}

          <div className="mt-4">
            <Link
              to="/login"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

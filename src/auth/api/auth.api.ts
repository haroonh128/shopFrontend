import { registrationFormValues } from "../../authentication/models/registration.model";
import { http } from "../../core/http";
import { AuthResponse, LoginRequest } from "../models";

export const login = (data: LoginRequest) =>
  http.post<AuthResponse, LoginRequest>("/Auth/login", data);

export const refresh = () =>
  http.post<AuthResponse, void>("/auth/refresh", undefined);

export const logout = () =>
  http.post<null, void>("/auth/logout", undefined);

export const register = (data: registrationFormValues) =>
  http.post<null, registrationFormValues>("/Auth/register", data);

export const verifyOtp = (data: { phoneNumber: string, otpCode: string }) =>
  http.post<AuthResponse, { phoneNumber: string, otpCode: string }>("/Auth/verify-otp", data);

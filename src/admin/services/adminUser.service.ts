import { http } from "../../core/http";
import type { AdminUser } from "../models/admin.models";

export type AdminCreateUserPayload = {
  phoneNumber: string;
  pin: string;
  confirmPin: string;
  firstName: string;
  lastName: string;
  email: string;
  cnic: string;
  appType: string;
  moduleId?: string | null;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  isAdmin: boolean;
  subscriptionValidUntil?: string | null;
};

export type AdminUpdateUserPayload = {
  phoneNumber: string;
  pin?: string | null;
  confirmPin?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  cnic: string;
  appType: string;
  moduleId?: string | null;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  isAdmin: boolean;
  subscriptionValidUntil?: string | null;
};

export const getAdminUsers = (search?: string) => {
  const qs = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return http.get<AdminUser[]>(`/AdminUser${qs}`);
};

export const getAdminUserById = (id: string) =>
  http.get<AdminUser>(`/AdminUser/${id}`);

export const createAdminUser = (data: AdminCreateUserPayload) =>
  http.post<AdminUser, AdminCreateUserPayload>("/AdminUser", data);

export const updateAdminUser = (id: string, data: AdminUpdateUserPayload) =>
  http.put<AdminUser, AdminUpdateUserPayload>(`/AdminUser/${id}`, data);

export const deleteAdminUser = (id: string) =>
  http.delete<boolean>(`/AdminUser/${id}`);

export const setAdminUserActive = (id: string, isActive: boolean) =>
  http.patch<AdminUser, { isActive: boolean }>(`/AdminUser/${id}/active`, { isActive });

export const updateAdminUserSubscription = (id: string, subscriptionValidUntil: string) =>
  http.put<AdminUser, { subscriptionValidUntil: string }>(`/AdminUser/${id}/subscription`, {
    subscriptionValidUntil,
  });

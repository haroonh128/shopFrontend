export type AdminUser = {
  id: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  cnic: string;
  appType: string;
  moduleId?: string | null;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  isAdmin: boolean;
  subscriptionValidUntil?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;
  isSubscriptionExpired: boolean;
};

export type AdminUserFormValues = {
  id?: string;
  phoneNumber: string;
  pin: string;
  confirmPin: string;
  firstName: string;
  lastName: string;
  email: string;
  cnic: string;
  appType: string;
  moduleId: string;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  isAdmin: boolean;
  subscriptionValidUntil: string;
};

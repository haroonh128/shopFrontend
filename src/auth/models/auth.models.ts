// types/auth.types.ts
export interface JwtUser {
    sub: string;
    email: string;
    role: string;
    exp: number;
  }
  
  export interface LoginRequest {
    phoneNumber: string;
    pin: string;
  }
  
  export interface AuthResponse {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: Date | null;
    requiresTwoFactor: boolean;
    user: {
      id: string;
      phoneNumber: string;
      isTwoFactorEnabled: boolean;
    }
  }
  
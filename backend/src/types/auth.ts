import { Request } from 'express';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}


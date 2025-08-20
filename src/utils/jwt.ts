import jwt from "jsonwebtoken";
import { User } from "../models";

interface TokenPayload {
  user_id: number;
  email: string;
  roles: string[];
}

export const generateToken = (user: User, roles: any): string => {
  const payload: TokenPayload = {
    user_id: user.id,
    email: user.email,
    roles: roles,
  };

  const secret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
  const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    payload,
    secret as jwt.Secret,
    {
      expiresIn: expiresIn,
    } as any
  );
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
  return jwt.verify(token, secret as jwt.Secret) as TokenPayload;
};

export const generateRefreshToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
  return jwt.sign({ user_id: user.id }, secret as jwt.Secret, {
    expiresIn: "7d",
  });
};

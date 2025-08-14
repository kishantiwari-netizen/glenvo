import jwt from "jsonwebtoken";
import crypto from "crypto";
import { TokenPayload } from "../../db/types";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
  private static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  static generateTokens(payload: TokenPayload): TokenResponse {
    const secret = this.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as any);

    const refreshToken = crypto.randomBytes(64).toString("hex");

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpiresInSeconds(this.JWT_EXPIRES_IN),
    };
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const secret = this.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not configured");
      }
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  private static getExpiresInSeconds(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 24 * 60 * 60;
      default:
        return 24 * 60 * 60; // Default to 24 hours
    }
  }

  static getRefreshTokenExpiry(): Date {
    const expiresIn = this.JWT_REFRESH_EXPIRES_IN;
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    const now = new Date();

    switch (unit) {
      case "s":
        return new Date(now.getTime() + value * 1000);
      case "m":
        return new Date(now.getTime() + value * 60 * 1000);
      case "h":
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case "d":
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    }
  }
}

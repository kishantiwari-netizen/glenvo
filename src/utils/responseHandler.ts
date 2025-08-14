import { Response } from "express";

// Response status codes
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Response messages
export const ResponseMessage = {
  // Success messages
  SUCCESS: "Operation completed successfully",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  REGISTER_SUCCESS: "User registered successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",

  // Error messages
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource already exists",
  VALIDATION_ERROR: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",

  // Auth specific messages
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_DEACTIVATED: "Account is deactivated",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_EXPIRED: "Token has expired",
  USER_EXISTS: "User with this email already exists",
  DEFAULT_ROLE_NOT_FOUND: "Default role not found",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  REFRESH_TOKEN_INVALID: "Invalid or expired refresh token",
} as const;

// Response data interface
export interface ResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  timestamp?: string;
}

// Pagination interface
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Response handler class
export class ResponseHandler {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data?: T,
    message: string = ResponseMessage.SUCCESS,
    statusCode: StatusCode = StatusCode.OK
  ): Response<ResponseData<T>> {
    const response: ResponseData<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string = ResponseMessage.INTERNAL_ERROR,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
    errors?: string[]
  ): Response<ResponseData> {
    const response: ResponseData = {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.CREATED
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.CREATED);
  }

  /**
   * Send updated response
   */
  static updated<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.UPDATED
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.OK);
  }

  /**
   * Send deleted response
   */
  static deleted(
    res: Response,
    message: string = ResponseMessage.DELETED
  ): Response<ResponseData> {
    return this.success(res, undefined, message, StatusCode.OK);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message: string = ResponseMessage.SUCCESS
  ): Response<ResponseData<T[]>> {
    const response: ResponseData<T[]> = {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };

    return res.status(StatusCode.OK).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    errors: string[],
    message: string = ResponseMessage.VALIDATION_ERROR
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.UNPROCESSABLE_ENTITY, errors);
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response,
    message: string = ResponseMessage.NOT_FOUND
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.NOT_FOUND);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = ResponseMessage.UNAUTHORIZED
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.UNAUTHORIZED);
  }

  /**
   * Send forbidden response
   */
  static forbidden(
    res: Response,
    message: string = ResponseMessage.FORBIDDEN
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.FORBIDDEN);
  }

  /**
   * Send conflict response
   */
  static conflict(
    res: Response,
    message: string = ResponseMessage.CONFLICT
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.CONFLICT);
  }

  /**
   * Send bad request response
   */
  static badRequest(
    res: Response,
    message: string = ResponseMessage.BAD_REQUEST,
    errors?: string[]
  ): Response<ResponseData> {
    return this.error(res, message, StatusCode.BAD_REQUEST, errors);
  }

  /**
   * Calculate pagination meta
   */
  static calculatePaginationMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  /**
   * Send login success response
   */
  static loginSuccess<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.LOGIN_SUCCESS
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.OK);
  }

  /**
   * Send logout success response
   */
  static logoutSuccess(
    res: Response,
    message: string = ResponseMessage.LOGOUT_SUCCESS
  ): Response<ResponseData> {
    return this.success(res, undefined, message, StatusCode.OK);
  }

  /**
   * Send register success response
   */
  static registerSuccess<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.REGISTER_SUCCESS
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.CREATED);
  }

  /**
   * Send password changed response
   */
  static passwordChanged(
    res: Response,
    message: string = ResponseMessage.PASSWORD_CHANGED
  ): Response<ResponseData> {
    return this.success(res, undefined, message, StatusCode.OK);
  }

  /**
   * Send profile updated response
   */
  static profileUpdated<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.PROFILE_UPDATED
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.OK);
  }

  /**
   * Send token refreshed response
   */
  static tokenRefreshed<T>(
    res: Response,
    data: T,
    message: string = ResponseMessage.TOKEN_REFRESHED
  ): Response<ResponseData<T>> {
    return this.success(res, data, message, StatusCode.OK);
  }
}

// Export commonly used response functions for convenience
export const {
  success,
  error,
  created,
  updated,
  deleted,
  paginated,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  conflict,
  badRequest,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  passwordChanged,
  profileUpdated,
  tokenRefreshed,
} = ResponseHandler;

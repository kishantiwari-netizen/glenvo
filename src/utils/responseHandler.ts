import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data?: T,
    message: string = 'Created successfully'
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500,
    error?: string
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message,
      error: error || message,
    };

    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 400, error);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 401, error);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 403, error);
  }

  static notFound(
    res: Response,
    message: string = 'Not found',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 404, error);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 409, error);
  }

  static validationError(
    res: Response,
    message: string = 'Validation error',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 422, error);
  }

  static withPagination<T>(
    res: Response,
    data: T,
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message: string = 'Success'
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      pagination,
    };

    return res.status(200).json(response);
  }
}

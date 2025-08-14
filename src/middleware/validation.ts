import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

export const validateRequest = (
  dtoClass: any,
  source: "body" | "query" | "params" = "body"
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Transform plain object to class instance
      const dtoObject = plainToClass(dtoClass, req[source]);

      // Validate the object
      const errors: ValidationError[] = await validate(dtoObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      });

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => {
          const constraints = error.constraints;
          return constraints
            ? Object.values(constraints)[0]
            : "Validation error";
        });

        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errorMessages,
        });
        return;
      }

      // Replace the request data with validated data
      req[source] = dtoObject;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: ["Invalid request data"],
      });
      return;
    }
  };
};

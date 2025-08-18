import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export function validateDTO(dtoClass: any) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
        return;
      }

      // Attach the validated object to the request
      req.body = dtoObject;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Validation error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  };
}

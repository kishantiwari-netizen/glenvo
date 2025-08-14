import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "unknown",
      message: error.msg,
      value: error.type === "field" ? error.value : undefined,
    }));

    res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
    return;
  }

  next();
};

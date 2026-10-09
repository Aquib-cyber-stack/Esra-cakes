import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "./errorHandler";

/** Validates req.body against a Zod schema, replacing it with the parsed/typed result. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(422, "Please check the form for errors.", result.error.flatten().fieldErrors);
    }
    req.body = result.data;
    next();
  };
}

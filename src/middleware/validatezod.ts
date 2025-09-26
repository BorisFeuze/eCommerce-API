import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod/v4';
import z from 'zod/v4';

type ValidationOptions = 'body' | 'params' | 'query';

const validateZod = (ZodSchema: ZodObject, property: ValidationOptions): RequestHandler => {
  return (request, response, next) => {
    if (!request[property])
      next(new Error(`please provide the validation with the ${property}`, { cause: { status: 400 } }));
    const { success, data, error } = ZodSchema.safeParse(request[property]);
    if (!success) {
      next(new Error(z.prettifyError(error), { cause: { status: 400 } }));
    } else {
      if (property === 'query') {
        request.sanitQuery = data;
      } else {
        request[property] = data;
      }
      next();
    }
  };
};

export default validateZod;

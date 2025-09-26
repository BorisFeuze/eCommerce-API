import z from 'zod/v4';
import { Types, isValidObjectId } from 'mongoose';

const stringIdSchema = z.string().refine(val => isValidObjectId(val), 'Invalid ID');

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date(),
  __v: z.int().nonnegative()
});

const querySchema = z.strictObject({
  categoryId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid category ID')
    .optional()
});

const paramSchema = z.strictObject({
  id: stringIdSchema
});

export { dbEntrySchema, querySchema, paramSchema };

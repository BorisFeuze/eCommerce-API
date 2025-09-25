import z from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { userInputSchema } from './zodusers';
import { dbEntrySchema } from './shared';

const productInputSchema = z.strictObject({
  // title: z.string().min(1, 'Title is required').max(1000).trim(),
  // content: z.string().min(1).trim(),
  // userId: z.string().refine(value => {
  //   return isValidObjectId(value);
  // }, 'Invalid owner ID')
});

const updateProductSchema = productInputSchema.omit({ userId: true });

const productSchema = z.strictObject({
  // ...productInputSchema.shape,
  // ...dbEntrySchema.shape,
  // userId: z.object({
  //   _id: z.instanceof(Types.ObjectId),
  //   ...userInputSchema.shape
  // })
});

export { productInputSchema, updateProductSchema, productSchema };

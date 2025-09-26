import z from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { isValidObjectId } from 'mongoose';

const productItemSchema = z.strictObject({
  productsId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid product ID'),

  quantity: z.number().min(0)
});

const orderInputSchema = z.strictObject({
  userId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid user ID'),
  products: z.array(productItemSchema),
  total: z.number().min(0)
});

const orderSchema = z
  .strictObject({
    ...orderInputSchema.shape,
    ...dbEntrySchema.shape,
    updatedAt: z.date()
  })
  .transform(({ _id, ...rest }) => ({
    id: _id,
    ...rest
  }));

export { orderInputSchema, orderSchema };

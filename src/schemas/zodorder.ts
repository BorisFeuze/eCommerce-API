import z from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { isValidObjectId } from 'mongoose';

const productItemSchema = z.strictObject({
  productId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid productID'),
  quantity: z.coerce.number().min(0)
});

const productItemSchemaArray = z.array(productItemSchema);

const orderInputSchema = z.strictObject({
  userId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid user ID'),
  products: productItemSchemaArray,
  total: z.coerce.number().min(0).default(0)
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

const orderSchemaArray = z.array(orderSchema);

export { orderInputSchema, orderSchema, orderSchemaArray, productItemSchema };

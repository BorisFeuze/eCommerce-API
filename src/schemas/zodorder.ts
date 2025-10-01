import z from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { isValidObjectId, Types } from 'mongoose';
import { userSchema } from './zodusers.ts';
import { productInputSchema } from './zodproduct.ts';

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

const orderSchema = z.strictObject({
  ...orderInputSchema.shape,
  products: [{ productId: z.instanceof(Types.ObjectId), quantity: z.coerce.number().min(0) }],
  userId: z.instanceof(Types.ObjectId),
  ...dbEntrySchema.shape,
  updatedAt: z.date()
});

const populatedUserSchema = z.strictObject({
  ...userSchema.shape,
  _id: z.instanceof(Types.ObjectId)
});

const populatedProductSchema = z.strictObject({
  ...productInputSchema.shape,
  categoryId: z.instanceof(Types.ObjectId),
  _id: z.instanceof(Types.ObjectId)
});

const orderSchemaArray = z.array(orderSchema);

export {
  orderInputSchema,
  orderSchema,
  orderSchemaArray,
  productItemSchema,
  productItemSchemaArray,
  populatedUserSchema,
  populatedProductSchema
};

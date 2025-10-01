import { z } from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { dbEntrySchema } from './shared.ts';
import { categorySchema } from './zodcategory.ts';

const productInputSchema = z.strictObject({
  name: z.string().min(1, 'Product_name is required').max(255).trim(),
  description: z.string().min(1).trim(),
  price: z.coerce.number(),
  categoryId: z
    .string()
    .min(1)
    .refine(value => {
      return isValidObjectId(value);
    }, 'Invalid categoryID')
});

const productSchema = z.strictObject({
  ...productInputSchema.shape,
  categoryId: z.instanceof(Types.ObjectId),
  ...dbEntrySchema.shape
});

const populatedCategorySchema = z.strictObject({
  ...categorySchema.shape,
  _id: z.instanceof(Types.ObjectId)
});

const productSchemaArray = z.array(productSchema);

export { productInputSchema, productSchema, productSchemaArray, populatedCategorySchema };

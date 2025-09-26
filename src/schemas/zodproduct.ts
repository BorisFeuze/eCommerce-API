import { z } from 'zod/v4';
import { isValidObjectId } from 'mongoose';
import { dbEntrySchema } from './shared.ts';

const productInputSchema = z.strictObject({
  name: z.string().min(1, 'Product_name is required').max(255).trim(),
  description: z.string().min(1).trim(),
  categoryId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid category ID')
});

const productSchema = z
  .strictObject({
    ...productInputSchema.shape,
    ...dbEntrySchema.shape
  })
  .transform(({ _id, ...rest }) => ({
    id: _id,
    ...rest
  }));

const productSchemaArray = z.array(productSchema);

export { productInputSchema, productSchema, productSchemaArray };

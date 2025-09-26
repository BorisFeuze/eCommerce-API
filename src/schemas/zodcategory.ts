import z from 'zod/v4';
import { dbEntrySchema } from './shared.ts';

const categoryInputSchema = z.strictObject({
  name: z.string().min(1, 'category_name is required').max(255).trim()
});

const categorySchema = z
  .strictObject({
    ...categoryInputSchema.shape,
    ...dbEntrySchema.shape
  })
  .transform(({ _id, ...rest }) => ({
    id: _id,
    ...rest
  }));

const categorySchemaArray = z.array(categorySchema);

export { categoryInputSchema, categorySchema, categorySchemaArray };

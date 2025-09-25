import z from 'zod/v4';
import { dbEntrySchema } from './shared';

const categoryInputSchema = z.strictObject({
  // firstName: z.string().min(1, 'First Name is required').max(255).trim(),
  // lastName: z.string().min(1, 'Last Name is required').trim(),
  // email: z.email({ pattern: z.regexes.email }).trim().toLowerCase(),
  // password: z.string().min(6, 'Passwort is required and must be at least characters long').max(255),
  // isActive: z.boolean().default(true)
});

const updateCategorySchema = categoryInputSchema.omit({ firstName: true, lastName: true, isActive: true });

const categorySchema = z.strictObject({
  // ...categoryInputSchema.shape,
  // ...dbEntrySchema.shape
});

export { categoryInputSchema, categorySchema, updateCategorySchema };

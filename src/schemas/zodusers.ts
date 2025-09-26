import z from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types } from 'mongoose';

const userInputSchema = z.strictObject({
  name: z.string().min(1, 'user_Name is required').max(255).trim(),
  email: z.email({ pattern: z.regexes.email }).trim().toLowerCase(),
  password: z.string().min(6, 'Passwort is required and must be at least characters long').max(255)
});

const userSchema = z
  .strictObject({
    ...dbEntrySchema.shape,
    name: z.string().min(1, 'user_Name is required').max(255).trim(),
    email: z.email({ pattern: z.regexes.email }).trim().toLowerCase()
  })
  .transform(({ _id, ...rest }) => ({
    id: _id,
    ...rest
  }));

const userSchemaArray = z.array(userSchema);

export { userInputSchema, userSchema, userSchemaArray };

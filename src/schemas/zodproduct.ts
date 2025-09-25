import z from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { userInputSchema } from './zodusers';
import { dbEntrySchema } from './shared';

const postInputSchema = z.strictObject({
  title: z.string().min(1, 'Title is required').max(1000).trim(),
  content: z.string().min(1).trim(),
  userId: z.string().refine(value => {
    return isValidObjectId(value);
  }, 'Invalid owner ID')
});

const updatePostSchema = postInputSchema.omit({ userId: true });

const postSchema = z.strictObject({
  ...postInputSchema.shape,
  ...dbEntrySchema.shape,
  userId: z.object({
    _id: z.instanceof(Types.ObjectId),
    ...userInputSchema.shape
  })
});

export { postInputSchema, updatePostSchema, postSchema };

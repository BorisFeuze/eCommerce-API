import { querySchema } from '#schemas/shared';
import { z } from 'zod/v4';

type QueryType = z.infer<typeof querySchema>;

export type { QueryType };

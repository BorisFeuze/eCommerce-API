import type { QueryType } from '#types';

declare global {
  namespace Express {
    export interface Request {
      sanitQuery?: QueryType;
    }
  }
}
export {};

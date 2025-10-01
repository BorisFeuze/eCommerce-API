import type { QueryType, ProductsType } from '#types';

declare global {
  namespace Express {
    export interface Request {
      sanitQuery?: QueryType;
    }
    export interface RequestBody {
      products?: ProductsType;
    }
  }
}
export {};

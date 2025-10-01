import {
  querySchema,
  orderInputSchema,
  orderSchema,
  categoryInputSchema,
  categorySchema,
  productInputSchema,
  productSchema,
  userInputSchema,
  userSchema,
  productItemSchema
} from '#schemas';
import { z } from 'zod/v4';

type QueryType = z.infer<typeof querySchema>;

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderDTO = z.infer<typeof orderSchema>;

type CategoryInputDTO = z.infer<typeof categoryInputSchema>;
type CategoryDTO = z.infer<typeof categorySchema>;

type ProductInputDTO = z.infer<typeof productInputSchema>;
type ProductDTO = z.infer<typeof productSchema>;

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = z.infer<typeof userSchema>;
type SuccessMg = { message: string };

type ProductsType = z.infer<typeof productItemSchema>;

export type {
  QueryType,
  OrderInputDTO,
  OrderDTO,
  CategoryDTO,
  CategoryInputDTO,
  ProductDTO,
  ProductInputDTO,
  UserDTO,
  UserInputDTO,
  SuccessMg,
  ProductsType
};
